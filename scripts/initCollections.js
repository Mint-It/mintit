const Web3 = require('web3');
var Tx = require('ethereumjs-tx').Transaction

const MintitMgrContract = require('../client/src/contracts/MintitNFTCollectionManager.json');

let owner = "0xf6a9333a400F490235B2526325365410353242e8";
let artist1 = "0x8DF01286D8D54D3159586004dF92ff9012912feF";
const privateKey1 = Buffer.from('74798b2f1b3c2aaf04fa1b81022e2e462fb843f3da31afaf7b60d6428d7eef76', 'hex');

let artist2 = "0x1AB822dEA7EDf7c792437bb3D4812A535EAbd893";
const privateKey2 = Buffer.from('fbb9fc7336c5a4f8b37c8ff146e365dce3a9ad8c165bb3fdfd9cf2a085f26ba7', 'hex');

const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545'); 
const web3 = new Web3(provider);

const initCollections = async () => {

    const networkId = await web3.eth.net.getId();
    const cAddress = MintitMgrContract.networks[networkId].address;

    const mintitMgr = new web3.eth.Contract(
        MintitMgrContract.abi,
        cAddress
    );
    let data;

    // Create TOCTOC artist
    let txCount = await web3.eth.getTransactionCount(artist1);
    data = mintitMgr.methods.setArtist("TocToc", "Street artist").encodeABI();
    sendMintitTransaction(data, cAddress, privateKey1, txCount)

    // Create Duss NFT collection
    txCount = await web3.eth.getTransactionCount(artist1);
    data = mintitMgr.methods.createDetailledMintitNFTCollection("DuDuss", "DUSS", 30, web3.utils.toWei("0.5", "ether"), web3.utils.toWei("1", "ether"), "https://images.squarespace-cdn.com/content/v1/55e6ffd8e4b03fb450e2a3e0/1563631832486-F7MSGAZA5VADVCWED7WO/logo1.png?format=1500w", "Le street artiste Toctoc, créatif et passionné, est à l’image de ses personnages : drôle et attachant.", "ipfs://QmfHqZdR8TTrspohWav6kgqbD5vwj5f289t28KPpat92Wo",".png").encodeABI();
    sendMintitTransaction(data, cAddress, privateKey1, txCount)

    
    // Create Other NFT collection
    txCount = await web3.eth.getTransactionCount(artist1);
    data = mintitMgr.methods.createDetailledMintitNFTCollection("DoDoss", "DOSS", 50, web3.utils.toWei("1", "ether"), web3.utils.toWei("2", "ether"), "https://images.squarespace-cdn.com/content/v1/55e6ffd8e4b03fb450e2a3e0/1563631832486-F7MSGAZA5VADVCWED7WO/logo1.png?format=1500w", "Le street artiste Toctoc, créatif et passionné, est à l’image de ses personnages : drôle et attachant.", "ipfs://QmfHqZdR8TTrspohWav6kgqbD5vwj5f289t28KPpat92Wo",".png").encodeABI();
    sendMintitTransaction(data, cAddress, privateKey1, txCount)


    // Create TICTIC artist
    txCount = await web3.eth.getTransactionCount(artist2);
    data = mintitMgr.methods.setArtist("TicTic", "Music artist").encodeABI();
    sendMintitTransaction(data, cAddress, privateKey2, txCount)
    txCount = await web3.eth.getTransactionCount(artist2);
    
    // Create Diss NFT collection
    txCount = await web3.eth.getTransactionCount(artist2);
    data = mintitMgr.methods.createDetailledMintitNFTCollection("DiDiss", "DISS", 80, web3.utils.toWei("3", "ether"), web3.utils.toWei("4", "ether"), "https://images.squarespace-cdn.com/content/v1/55e6ffd8e4b03fb450e2a3e0/1563631832486-F7MSGAZA5VADVCWED7WO/logo1.png?format=1500w", "Le street artiste Toctoc, créatif et passionné, est à l’image de ses personnages : drôle et attachant.", "ipfs://QmfHqZdR8TTrspohWav6kgqbD5vwj5f289t28KPpat92Wo",".png").encodeABI();
    sendMintitTransaction(data, cAddress, privateKey2, txCount)

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
       })
}

  
initCollections();