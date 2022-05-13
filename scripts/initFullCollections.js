const Web3 = require('web3');
var Tx = require('ethereumjs-tx').Transaction

const MintitMgrContract = require('../client/src/contracts/MintitNFTCollectionManager.json');
const MintitContract = require('../client/src/contracts/MintitNFTCollection.json');

let owner = "0x46461745030D75cED0Fc9fbee2e9b53510475C7e";
let artist1 = "0x2187949a573b37E2e9CE6Db0615D25bB5d9E6eEF";
const privateKey1 = Buffer.from('b5e700b07ca0d5ff07070ff4c4f73b728d5c1dc2623979479924cfe848baca4b', 'hex');

let artist2 = "0x6C3c20F3a3b09ba55D1fA3b298175AE80FEe9d83";
const privateKey2 = Buffer.from('e9f6d4a694a268fc160284dab5f63ba7de1af919ab89179bd5d3f1c650d9341a', 'hex');

const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545'); 
const web3 = new Web3(provider);
let artists = [
["CryptoBearWatchClub", "CBWC Deployer", "0x2187949a573b37E2e9CE6Db0615D25bB5d9E6eEF", "b5e700b07ca0d5ff07070ff4c4f73b728d5c1dc2623979479924cfe848baca4b"],
["KarafuruDeployer", "", "0x6C3c20F3a3b09ba55D1fA3b298175AE80FEe9d83", "e9f6d4a694a268fc160284dab5f63ba7de1af919ab89179bd5d3f1c650d9341a"]
];

let col = [
[0, "The CryptoBear Watch Club", "CBWC", 30, "0.5", "1",
"https://lh3.googleusercontent.com/uYwlGK1Flj_QxlwFV-6o80nHbCY40Q_67gxYZiv5DNtTFDZaQG0AGwZ3Ir1YOa26z08ygce3UeCiGG--NaAuiFezySlpC9SbZyHOiWA=h200",
"OS Holder number doesn't include STAKED CBWC. 73% unique holders currently staked to earn the $ARK utility token.",
"Arts", "https://cryptobearwatchclub.mypinata.cloud/ipfs/QmX8kGmiRD5crgp3WZHgch2M7wEhCyStev9vpqxycQ713p/", ".png",
[1, getTs()-3600, getTs() + 36000]],
[1, "Karafuru", "Karafuru", 5555, "0.8", "1.2",
"https://lh3.googleusercontent.com/wagZQjBQU0NZnTjlHHdBjDCgE0AvP1K4WGNYsCSTTj2Gib2N0LbE4uWC76w510bbyXFtqWTqj_1rlK_ZZ0KfZvGYuEBA5NivGuBnIw=h200",
"Karafuru is home to 5,555 generative arts where colors reign supreme. Leave the drab reality and enter the world of Karafuru by Museum of Toys.",
"Arts", "https://opensea.mypinata.cloud/ipfs/QmdJ8S7YfZmXQJYdieyHJhNpAUnqQ8KEQsgZ4EAdwYk7tx/", ".jpg",
[2, getTs()-3600, getTs() + 36000]],
[1, "Quirkies Originals", "", 5000, "3", "4",
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

    for (i=0;i<artists.length;i++) {
        txCount = await web3.eth.getTransactionCount(artists[i][2]);
        data = mintitMgr.methods.setArtist(artists[i][0], artists[i][1]).encodeABI();
        console.log(artists[i][2] + ":" + artists[i][3]);
        sendMintitTransaction(data, cAddress, Buffer.from(artists[i][3], 'hex'), txCount);
    }

    for (i=0;i<3;i++) {
        // Create NFT collection
        txCount = await web3.eth.getTransactionCount(artists[col[i][0]][2]);
        data = mintitMgr.methods.createDetailledMintitNFTCollection(col[i][1], col[i][2], col[i][3], web3.utils.toWei(col[i][4], "ether"), web3.utils.toWei(col[i][5], "ether"), col[i][6], col[i][7], col[i][8], col[i][9], col[i][10]).encodeABI();
        sendMintitTransaction(data, cAddress, Buffer.from(artists[col[i][0]][3], 'hex'), txCount)
    }

    let colArray = await  mintitMgr.methods.getCollectionArray().call({from:artist1});
    for (i=0;i<3;i++) {

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
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
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

  
initCollections();