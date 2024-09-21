// import { Web3Provider } from "@ethersproject/providers";
const  { BigNumber, Contract, ethers } = require("ethers");

const {
  SignProtocolClient,
  SpMode,
  EvmChains,
  IndexService
} = require('@ethsign/sp-sdk');

const { privateKeyToAccount } = require('viem/accounts');


// import ISPABI from '../ISPABI.json';
const ISPABI = require('./ISPABI.json');

require('dotenv').config();



async function createNotaryAttestation(fromAddr, fileName, fileType, fileData, toAddr, metadata, timestamp) {
    
  console.log('process.env.BASE_SEPOLIA----- ', process.env.BASE_SEPOLIA)
      // Add "0x" to the start of your private key if it's not already there
      const PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY1; 
      const account = privateKeyToAccount(PRIVATE_KEY);
  
      const client = new SignProtocolClient(SpMode.OnChain, {
          // pass in the same network you registered your schema on
          chain: EvmChains['baseSepolia'], // or sepolia
          account
      });
  
  console.log("index value : ", toAddr)
  // Send the attestation transaction
  const schemaData = {fromAddr, fileName, fileType, fileData, toAddr, metadata, timestamp};

  try {
    const tx = await client.createAttestation({
        schemaId: "0x2cb", // the schema id
        data: schemaData,
        indexingValue: toAddr, // indexing value. Hint: use a unique property from your schema
        recipients: [toAddr], // The signer's address.
    });
    console.log("transaction Hash:----- ", tx)
    return tx;
  } catch (error) {
      throw error
  }
}

module.exports={createNotaryAttestation}

// createNotaryAttestation("0x290ABcfdbB5046EDeDC589eFef2BB2EfAfc6b6ca", "1234", "amazon1.com", "social1", "0x729474d7Ea71731B3122688Fd1C73248d6256471", 'no metadata', '153455666666')