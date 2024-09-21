
const axios = require("axios");
const  { ethers } = require("ethers");
const {
    SignProtocolClient,
    SpMode,
    EvmChains,
    IndexService
} = require('@ethsign/sp-sdk');
// Generate a function for making requests to the Sign Protocol Indexing Service
async function makeAttestationRequest(endpoint, options) {
  const url = `https://testnet-rpc.sign.global/api/${endpoint}`;
  const res = await axios.request({
    url,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    ...options,
  });
  // Throw API errors
  if (res.status !== 200) {
    throw new Error(JSON.stringify(res));
  }
  // Return original response
  return res.data;
}


async function queryAttestations(indexingValue) {
    const response = await makeAttestationRequest("index/attestations", {
      method: "GET", 
      params: {
        mode: "onchain", // Data storage location
        schemaId: "onchain_evm_84532_0x2cb", // Your full schema's ID
        attester: "0xdaCD9AA32D83955a71Ab1FEC032BA5914FCceB5B", // Alice's address
        indexingValue: indexingValue, // Bob's address
      },
    });
  
    // Make sure the request was successfully processed.
    // console.log("response====== ", response)
    if (!response.success) {
      return {
        success: false,
        message: response?.message ?? "Attestation query failed.",
      };
    }

    // Return a message if no attestations are found.
    if (response.data?.total === 0) {
      return {
        success: false,
        message: "No attestation for this address found.",
      };
    }
    // Return all attestations that match our query.
    const attestation = await findAttestation('', atresponse.data.rows.attestations)
    console.log("attestation----------- ", attestation)
  }
const { decodeAbiParameters } = require("viem");




// queryAttestations("0x729474d7Ea71731B3122688Fd1C73248d6256471").then( async (resp)=>{

//     // console.log("queryAttestation response: ", await resp)
//     const result = await resp;
//     console.log("attentation....1 ", result.attestations)
//     const attestation = await findAttestation('',result.attestations)
//     console.log("parsed attestation----- ", attestation)
// })



function findAttestation(message, attestations) {   //attestations: any[]
    // Iterate through the list of attestations
    let parsedData = [];
    for (const att of attestations) {
     console.log('-------att', att)   
      if (!att.data) continue;
  
      
      // Parse the data.
      if (att.mode === "onchain") {
        // Looking for nested items in the on-chain schema
        try {
          const data = decodeAbiParameters(
            [att.dataLocation === "onchain" ? { components: att.schema.data, type: "tuple" } : { type: "string" }],
            att.data
          );
          parsedData.push(data[0]);
        } catch (error) {
          // Looking for a regular schema format if the nested parse fails
          try {
            const data = decodeAbiParameters(
              att.dataLocation === "onchain" ? att.schema.data : [{ type: "string" }],
              att.data
            );
            const obj = {};
            data.forEach((item, i) => {
              obj[att.schema.data[i].name] = item;
            });
            parsedData.push(obj);
          } catch (error) {
            continue;
          }
        }
      } else {
        // Try parsing as a string (off-chain attestation)
        try {
          parsedData.push(JSON.parse(att.data));
        } catch (error) {
          console.log(error);
          continue;
        }
      }
      
      // Return the correct attestation and its parsed data.
      console.log("..........", parsedData?.contractDetails)
    //   if(parsedData?.contractDetails === message) {
        // return { parsedData, attestation: att };
    //   }
    }
    
    // Did not find the attestation we are looking for.
    return parsedData;
}

module.exports ={makeAttestationRequest}

