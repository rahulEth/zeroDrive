const fs = require("fs");
const dotenv = require("dotenv");
const Moralis = require("moralis").default;
// const { Provider, Wallet, types } = require('zksync-ethers');
dotenv.config();
const { connectToDatabase } = require("./db.js");
const cors = require("cors");
const crypto = require("crypto");
const provider = require("./web3.js");
const {getProof, setProof} = require('./utils/hedera.js');
const {createNotaryAttestation} = require('./sign-protocol/attestation.js')
const {queryAttestations} = require('./sign-protocol/queryAttestation.js')

// index.js

const express = require("express");
const app = express();
const CryptoJS = require("crypto-js");
const corsOptions = require("./config/corsOptions.js");
// Use CORS middleware
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());
// Set the port number to listen on
const PORT = process.env.PORT || 3000;

// Define a simple route
app.post("/api/saveConfidential", (req, res) => {
  // Encrypt the message with the public key
  // const type = req.body.type || "personal";
  if (!req.body.address || !req.body.fileName || !req.body.encryptedData) {
    return res
      .status(403)
      .send({ message: "address, fileName or encryptedData is missing" });
  }

  if (  
    !req.body.dataType
  ) {
    return res.status(403).send({
      message:
        "type is missing only education, identity, health, government and other type accepted",
    });
  }

  if (!req.body.chainType) {
    return res.status(403).send({
      message:
        "chain type is missing",
    });
  }

  uploadToIpfs(
    res,
    req.body.address,
    req.body.fileName,
    req.body.encryptedData,
    req.body.dataType,
    req.body.chainType
  );
});

async function uploadToIpfs(
  res,
  address,
  fileName,
  encryptedData,
  dataType,
  chainType
) {
  const fileUploads = [
    {
      path: "zerodrive",
      content: {
        address,
        fileName,
        encryptedData,
        dataType,
        chainType
      },
    },
  ];
  if (!Moralis.Core.isStarted) {
    await Moralis.start({
      apiKey: process.env.MORALIS_KEY,
    });
  } else {
    console.log("Moralis is already started!");
  }
  const resp = await Moralis.EvmApi.ipfs.uploadFolder({
    abi: fileUploads,
  });
  console.log(resp.result);
  const date = new Date();
  storeToDB(
    address,
    resp.result,
    fileName,
    encryptedData,
    dataType,
    chainType,
    date
  );  
  return res.status(200).send({
    address,
    fileName,
    chainType,
    ipfsHash: resp.result,
    dataType,
    chainType,
    date
  });
}

async function storeToDB(
  address,
  ipfsHash,
  fileName,
  encryptedData,
  dataType,
  chainType,
  date
) {
  const resp = await setProof(address, ipfsHash[0].path);
  const txHash = `https://hashscan.io/testnet/transaction/${resp.transactionId}`
  const db = await connectToDatabase();
  const collection = db.collection("zerodrive-collection");
  const result = await collection.insertOne({
    address,
    ipfsHash,
    fileName,
    encryptedData,
    dataType,
    chainType,
    txHash,
    date
  });
  console.log("document inserted Id ", result.insertedId.toString());
}

app.get("/api/getEncryptedDataAll", async (req, res) => {
  // console.log("req.query.appLink ------ ", req.query.appLink, req.query.address)
  if (!req.query.userAddr) {
    return res.status(403).send({ message: "userAddr is missing" });
  }
  const db = await connectToDatabase();
  const collection = db.collection("zerodrive-collection");
  try {
    const result = await collection.find({address: req.query.userAddr});
    if (result) {
      const finalResult = await result.toArray();
      JSON.stringify(finalResult, null, 2);
      return res.status(200).send(finalResult);
    }
    return res.status(404).send({ message: "no matching credentials found" });
  } catch (err) {
    console.log("internal server err ", err);
    return res.status(500).send({ message: "internal server error" });
  }
});

app.get("/api/getEncryptedDataByType", async (req, res) => {
  console.log("req.query.dataType ------ ", req.query.dataType, req.query.userAddr)
  if (!req.query.dataType || !req.query.userAddr) {
    return res.status(403).send({ message: "dataType or userAddr is missing" });
  }
  const db = await connectToDatabase();
  const collection = db.collection("zerodrive-collection");
  let query = {};
  if(req.query.dataType.toLowerCase() == 'all'){
    query = {
      address: req.query.userAddr,
    }
  }else if(req.query.dataType == 'personal' || req.query.dataType == 'education' || req.query.dataType == 'identity' || req.query.dataType == 'health' || req.query.dataType == 'government'){
    query = {
      dataType: req.query.dataType,
      address: req.query.userAddr,
    }
  }else{
    return res.status(403).send({ message: "valid type are personal, education, identity, health, government" });
  }
  try {
    const result = await collection.find(query);
    if (result) {
      const finalResult = await result.toArray();
      JSON.stringify(finalResult, null, 2);
      return res.status(200).send(finalResult);
    }
    return res.status(404).send({ message: "no matching credentials found" });
  } catch (err) {
    console.log("internal server err ", err);
    return res.status(500).send({ message: "internal server error" });
  }
});


// Define a simple route
app.post("/api/sendToAddress", async (req, res) => {
  // Encrypt the message with the public key
  // const type = req.body.type || "personal";
  // fromAddr, fileName, fiType, fileData, toAddr, metadata, timestamp
  if (!req.body.fromAddr || !req.body.fileName || !req.body.dataType) {
    return res
      .status(403)
      .send({ message: "fromAddr, fileName or fileType is missing" });
  }

  if (  
    !req.body.fileData || !req.body.toAddr
  ) {
    return res.status(403).send({
      message:
        "fileData or toAddr is missing",
    });
  }

  const timestamp = new Date();
  const metadata = 'NA';

  let result = await createNotaryAttestation(req.body.fromAddr, req.body.fileName, req.body.dataType, req.body.fileData, req.body.toAddr, metadata, timestamp)
  result =JSON.parse(JSON.stringify(result))
  result.txHash = `https://testnet-scan.sign.global/attestation/onchain_evm_84532_${result.attestationId}` 
  return res.send(result); 
});

app.get("/api/receivedDocs", async (req, res) => {
  // console.log("req.query.appLink ------ ", req.query.appLink, req.query.address)
  if (!req.query.userAddr) {
    return res.status(403).send({ message: "userAddr is missing" });
  }

  const result = await queryAttestations(req.query.userAddr)

  res.status(200).send(result)
});


// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
