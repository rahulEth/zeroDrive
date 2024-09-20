const { SignProtocolClient, SpMode, EvmChains } = require("@ethsign/sp-sdk");
const { privateKeyToAccount } = require("viem/accounts");
require('dotenv').config()

const privateKey = process.env.METAMASK_PRIVATE_KEY;
console.log('privateKey---- ', privateKey)
const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.baseSepolia,
  account: privateKeyToAccount(privateKey), // Optional, depending on environment
});


// creating an schema
const createSchema = async ()=>{
    console.log('start cteating schema---------')
    const resp = await client.createSchema({
        name: "zeroDriveSchema",
        data: [
            {"name":"fromAddr","type":"address"}, // 
            {"name":"fileName","type":"string"},
            {"name":"fileType","type":"string"}, //  pancard
            { "name": "fileData", "type": "string"},  //actual data
            { "name": "toAddr", "type": "address"}, 
            {"name":"metadata","type":"string"},
            {"name":"timestamp","type":"string"}
            
        ]
            
    })
    
    console.log("resp------  ", resp)
}


createSchema()

// resp------   {
//     schemaId: '0x2cb',
//     txHash: '0x33591ddb65c636a180567b98340cbb16a273f0f19e87dc1c06896f8e4c1a945d'
//   }


// const [PDA] = PublicKey.findProgramAddressSync(
//     [Buffer.from("data"), user.publicKey.toBuffer()],
//     program.programId,
//    );
   
   
//    it("Is initialized!", async () => {
//     const transactionSignature = await program.methods
//       .initialize()
//       .accounts({
//         user: user.publicKey,
//         pdaAccount: PDA,
//       })
//       .rpc();
//     console.log("Transaction Signature:", transactionSignature);
//    });
//    it("Fetch Account", async () => {
//     const pdaAccount = await program.account.dataAccount.fetch(PDA);
//     console.log(JSON.stringify(pdaAccount, null, 2));
//    });
