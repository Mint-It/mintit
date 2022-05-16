const Web3 = require('web3');
var Tx = require('ethereumjs-tx').Transaction;
var Common = require('ethereumjs-common').default;

const MintitMgrContract = require('../client/src/contracts/MintitNFTCollectionManager.json');
const MintitContract = require('../client/src/contracts/MintitNFTCollection.json');

let owner = "0xD07193529CB72bdb8620113C8444d1E63e5C0D6a";
let artist1 = "0xA32709cE9e8eE20785f621f8C8b7b675C44c421b";
const privateKey1 = Buffer.from('ba8378ed8457edc80633f9b8408d9de55e18f505edf0072070a5a93f792747b7', 'hex');

let artist2 = "0x17578077C690720c8A0e3FbEb715908D6809eFBF";
const privateKey2 = Buffer.from('bb038f35f1fc47e2eaf1b47c2138e2b0aeae1d781b9a99b75cf90884ced40f11', 'hex');

let user1 = "0x78Cf7A6829eDEcACc022694d2623B47c8FC1Fd03";
const puser1 = Buffer.from('0fab2b69c808e4774389cbd5c52b489bb58b2e075d72cb8a0dee8b3982150e60', 'hex');

let user2 = "0x58bA5FF62dEbf475EEAE1075934a8c96Cd66250a";
const puser2 = Buffer.from('bf990407d6c37dadd5f3c50215fecedbaa15d3a7389e96ea6f866e7a30899e93', 'hex');

const provider = new Web3.providers.HttpProvider('https://api.avax-test.network/ext/bc/C/rpc'); 
const web3 = new Web3(provider);
let artists = [
["CryptoBearWatchClub", "CBWC Deployer", "0xA32709cE9e8eE20785f621f8C8b7b675C44c421b", "ba8378ed8457edc80633f9b8408d9de55e18f505edf0072070a5a93f792747b7"],
];

let col = [
[0, "The CryptoBear Watch Club", "CBWC", 30, "0.2", "0.3",
"https://lh3.googleusercontent.com/uYwlGK1Flj_QxlwFV-6o80nHbCY40Q_67gxYZiv5DNtTFDZaQG0AGwZ3Ir1YOa26z08ygce3UeCiGG--NaAuiFezySlpC9SbZyHOiWA=h200",
"OS Holder number doesn't include STAKED CBWC. 73% unique holders currently staked to earn the $ARK utility token.",
"Arts", "https://cryptobearwatchclub.mypinata.cloud/ipfs/QmX8kGmiRD5crgp3WZHgch2M7wEhCyStev9vpqxycQ713p/", ".png",
[1, getTs()-3600, getTs() + 3600, 2, getTs()+3600, getTs() + 7200, 3, getTs()+7200, getTs() + 10000]]
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

    for (i=0;i<artists.length;i++) {
        txCount = await web3.eth.getTransactionCount(artists[i][2]);
        data = mintitMgr.methods.setArtist(artists[i][0], artists[i][1]).encodeABI();
        console.log(artists[i][2] + ":" + artists[i][3]);
        sendMintitTransaction(data, cAddress, Buffer.from(artists[i][3], 'hex'), txCount);
    }

    for (i=0;i<1;i++) {
        // Create NFT collection
        txCount = await web3.eth.getTransactionCount(artists[col[i][0]][2]);
        data = mintitMgr.methods.createMintitNFTCollection(col[i][1], col[i][2], [col[i][3], web3.utils.toWei(col[i][4], "ether"), web3.utils.toWei(col[i][5], "ether"), 2], [col[i][6], col[i][7], col[i][8], col[i][9], col[i][10]]).encodeABI();
        sendMintitTransaction(data, cAddress, Buffer.from(artists[col[i][0]][3], 'hex'), txCount)
    }

    let colArray = await  mintitMgr.methods.getCollectionArray().call({from:artist1});
    for (i=0;i<1;i++) {
        let mintitNFT = new web3.eth.Contract(MintitContract.abi, colArray[i]);
        txCount = await web3.eth.getTransactionCount(artists[col[i][0]][2]);
        data = mintitNFT.methods.setCalendar(col[i][11]).encodeABI();
        sendMintitTransaction(data, colArray[i], Buffer.from(artists[col[i][0]][3], 'hex'), txCount);
    }

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
        gasPrice: web3.utils.toHex(web3.utils.toWei('25', 'gwei')),
        to: address,
        data: data
       }

       const customCommon = Common.forCustomChain(
        'mainnet',
        {
          name: 'fuji',
          networkId: 1,
          chainId: 43113,
        },
        'petersburg',
       );

       // Sign the transaction
       const tx = new Tx(txObject, { common: customCommon })
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
        gasLimit: web3.utils.toHex(5000000), // Raise the gas limit to a much higher amount
        gasPrice: web3.utils.toHex(web3.utils.toWei('25', 'gwei')),
        to: address,
        value: web3.utils.toHex(web3.utils.toWei(value, 'ether')),
        data: data
       }

       const customCommon = Common.forCustomChain(
        'mainnet',
        {
          name: 'fuji',
          networkId: 1,
          chainId: 43113,
        },
        'petersburg',
       );

       // Sign the transaction
       const tx = new Tx(txObject, { common: customCommon },)
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