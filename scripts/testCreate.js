const Web3 = require('web3');
var Tx = require('ethereumjs-tx').Transaction
const MintitContract = require('../client/src/contracts/MintitNFTSimple.json');

const MintitMgrContract = require('../client/src/contracts/MintitNFTCollectionManager.json');

let owner = "0xD07193529CB72bdb8620113C8444d1E63e5C0D6a";
let artist1 = "0xA32709cE9e8eE20785f621f8C8b7b675C44c421b";
const privateKey1 = Buffer.from('ba8378ed8457edc80633f9b8408d9de55e18f505edf0072070a5a93f792747b7', 'hex');

let artist2 = "0x17578077C690720c8A0e3FbEb715908D6809eFBF";
const privateKey2 = Buffer.from('bb038f35f1fc47e2eaf1b47c2138e2b0aeae1d781b9a99b75cf90884ced40f11', 'hex');

let user1 = "0x78Cf7A6829eDEcACc022694d2623B47c8FC1Fd03";
const puser1 = Buffer.from('0fab2b69c808e4774389cbd5c52b489bb58b2e075d72cb8a0dee8b3982150e60', 'hex');

let user2 = "0x58bA5FF62dEbf475EEAE1075934a8c96Cd66250a";
const puser2 = Buffer.from('bf990407d6c37dadd5f3c50215fecedbaa15d3a7389e96ea6f866e7a30899e93', 'hex');

const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545'); 
const web3 = new Web3(provider);
let artists = [
["CryptoBearWatchClub", "CBWC Deployer", "0xA32709cE9e8eE20785f621f8C8b7b675C44c421b", "ba8378ed8457edc80633f9b8408d9de55e18f505edf0072070a5a93f792747b7"],
["KarafuruDeployer", "", "0x17578077C690720c8A0e3FbEb715908D6809eFBF", "bb038f35f1fc47e2eaf1b47c2138e2b0aeae1d781b9a99b75cf90884ced40f11"]
];

let col = [
[0, "The CryptoBear Watch Club", "CBWC", 30, "0.2", "0.3",
"https://lh3.googleusercontent.com/uYwlGK1Flj_QxlwFV-6o80nHbCY40Q_67gxYZiv5DNtTFDZaQG0AGwZ3Ir1YOa26z08ygce3UeCiGG--NaAuiFezySlpC9SbZyHOiWA=h200",
"OS Holder number doesn't include STAKED CBWC. 73% unique holders currently staked to earn the $ARK utility token.",
"Arts", "https://cryptobearwatchclub.mypinata.cloud/ipfs/QmX8kGmiRD5crgp3WZHgch2M7wEhCyStev9vpqxycQ713p/", ".png",
[1, getTs()-3600, getTs() + 3600, 2, getTs()+3600, getTs() + 7200, 3, getTs()+7200, getTs() + 10000]],
[1, "Karafuru", "Karafuru", 5555, "0.4", "0.5",
"https://lh3.googleusercontent.com/wagZQjBQU0NZnTjlHHdBjDCgE0AvP1K4WGNYsCSTTj2Gib2N0LbE4uWC76w510bbyXFtqWTqj_1rlK_ZZ0KfZvGYuEBA5NivGuBnIw=h200",
"Karafuru is home to 5,555 generative arts where colors reign supreme. Leave the drab reality and enter the world of Karafuru by Museum of Toys.",
"Arts", "https://opensea.mypinata.cloud/ipfs/QmdJ8S7YfZmXQJYdieyHJhNpAUnqQ8KEQsgZ4EAdwYk7tx/", ".jpg",
[2, getTs()-3600, getTs() + 36000]],
[1, "Quirkies Originals", "", 20, "0.05", "0.08",
"https://lh3.googleusercontent.com/TS2mwNzus7SqEjSjKVu7Gmj1lpnZc4u8x-wrvTlZvU7jEVMHLi3edj7TyudKaKvSM79x_0ORmQc0ATXotUJsBNrrE8j5MY4piS7aM6Q=h200",
"5,000 Quirkies brought into the metaverse to celebrate everyone's quirks",
"Arts", "http://metadata.quirkies.io/", ".png",
[3, getTs()-3600, getTs() + 36000]],
["", "", 30, 0.5, 1,
"",
"",
"Arts", "", ".png"]
];

console.log(getTs());

function getTs() {
    return parseInt(Date.now()/1000);
}

const initCollections = async () => {

    const networkId = await web3.eth.net.getId();
    const cAddress = MintitMgrContract.networks[networkId].address;

    const mintitMgr = new web3.eth.Contract(
        MintitMgrContract.abi,
        cAddress
    );

    let data;
    let i;
    let txCount;

    txCount = await web3.eth.getTransactionCount(artists[col[0][0]][2]);
    data = mintitMgr.methods.createMintitBaseCollection().encodeABI();
    sendMintitTransaction(data, cAddress, Buffer.from(artists[col[0][0]][3], 'hex'), txCount);

    for (i=0;i<1;i++) {
        // Create NFT collection
        txCount = await web3.eth.getTransactionCount(artists[col[i][0]][2]);
        data = mintitMgr.methods.createMintitNFTCollection(col[i][1], col[i][2], [col[i][3], web3.utils.toWei(col[i][4], "ether"), web3.utils.toWei(col[i][5], "ether"), 2], [col[i][6], col[i][7], col[i][8], col[i][9], col[i][10]]).encodeABI();
        sendMintitTransaction(data, cAddress, Buffer.from(artists[col[i][0]][3], 'hex'), txCount)
    }

    let colArray = await  mintitMgr.methods.getCollectionArray().call({from:artist1});


    let mintitNFT = new web3.eth.Contract(MintitContract.abi, colArray[1]);
    txCount = await web3.eth.getTransactionCount(artists[1][2]);

    //let strTest = await  mintitNFT.methods.getTest().call({from:artist1});
    //console.log("Test result: " + strTest);

    console.log("---------------------------");
    console.log(" List of NFT collection adresses");
    console.log(await  mintitMgr.methods.getCollectionArray().call({from:artist1}) );
    console.log("---------------------------");

    console.log(" Details of artist1");
    console.log(await  mintitMgr.methods.getArtistDetails(artist1).call({from:artist2}) );
    console.log("---------------------------");
    console.log(" Details of artist2");
    console.log(await  mintitMgr.methods.getArtistDetails(artist2).call({from:artist2}) );

} 

function sendMintitTransaction(data, address, privatekey, txCount) {
    const txObject = {
        nonce:    web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(5000000), // Raise the gas limit to a much higher amount
        gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei')),
        to: address,
        data: data
       }

       // Sign the transaction
       const tx = new Tx(txObject, { chain: 'mainnet' })
       tx.sign(privatekey)
       const serializedTransaction = tx.serialize()
       const raw = '0x' + serializedTransaction.toString('hex')
       // Broadcast the transaction
       web3.eth.sendSignedTransaction(raw, (err, txHash) => {
            console.log('txHash: ', txHash)
            console.log(err)
       }).on('receipt', console.log);

}

function sendMintitValueTransaction(data, address, privatekey, txCount, value) {
    const txObject = {
        nonce:    web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(10000000), // Raise the gas limit to a much higher amount
        gasPrice: web3.utils.toHex(web3.utils.toWei('50', 'gwei')),
        to: address,
        value: web3.utils.toHex(web3.utils.toWei(value, 'ether')),
        data: data
       }

       // Sign the transaction
       const tx = new Tx(txObject, { chain: 'mainnet' })
       tx.sign(privatekey)
       const serializedTransaction = tx.serialize()
       const raw = '0x' + serializedTransaction.toString('hex')
       // Broadcast the transaction
       web3.eth.sendSignedTransaction(raw, (err, txHash) => {
            console.log('txHash: ', txHash)
            console.log(err)
       }).on('receipt', console.log);

}
  
initCollections();