require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

// https://base-mainnet.g.alchemy.com/v2/9Gt8lpwu_WelXSIE83OLYtiB0Smb3CWS
// sapolia
const META_MASK_PRIVATE_KEY= process.env.APP_PRIVATE_KEY;
console.log('META_MASK_PRIVATE_KEY------- ', META_MASK_PRIVATE_KEY)

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers:[
      {
        version: "0.8.0"
      },
      {
        version: "0.8.13"
      },
      {
        version: "0.8.22"
      }
    ]
  },
  networks:{
    localhost:{
      url: 'http://127.0.0.1:8545'
    },
    hederaTestnet:{
      // url: `https://base-sepolia.infura.io/v3/${INFURA_API_KEY}`,
      url : `https://testnet.hashio.io/api`,
      accounts: [META_MASK_PRIVATE_KEY] ,
    },

  }
};