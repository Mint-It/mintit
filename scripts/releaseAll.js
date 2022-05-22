const Web3 = require('web3');
var Tx = require('ethereumjs-tx').Transaction

const MintitMgrContract = require('../client/src/contracts/MintitNFTCollectionManager.json');
const MintitContract = require('../client/src/contracts/MintitNFTCollection.json');

let owner = "0xD07193529CB72bdb8620113C8444d1E63e5C0D6a";
let artist1 = "0xA32709cE9e8eE20785f621f8C8b7b675C44c421b";
const privateKey1 = Buffer.from('ba8378ed8457edc80633f9b8408d9de55e18f505edf0072070a5a93f792747b7', 'hex');

const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545'); 
const web3 = new Web3(provider);

const releaseCollections = async () => {

    const networkId = await web3.eth.net.getId();
    const cAddress = MintitMgrContract.networks[networkId].address;

    const mintitMgr = new web3.eth.Contract(
        MintitMgrContract.abi,
        cAddress
    );

    let data;
    let i;
    let txCount;

    let collections = await mintitMgr.methods.getCollectionArray().call({from:artist1});
    for (i=0;i<collections.length;i++) {
        console.log("Release all shares for collection :" + collections[i]);
        let mintitNFT = new web3.eth.Contract(MintitContract.abi, collections[i]);
        txCount = await web3.eth.getTransactionCount(artist1);
        data = mintitNFT.methods.releaseAll().encodeABI();
        sendMintitTransaction(data, collections[i], privateKey1, txCount);
    }
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

function sendMintitValueTransaction(data, address, privatekey, txCount, value) {
    const txObject = {
        nonce:    web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(5000000), // Raise the gas limit to a much higher amount
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
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
  
releaseCollections();