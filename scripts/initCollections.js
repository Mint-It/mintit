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
    data = mintitMgr.methods.createMintitNFTCollection("DUSS", "DUSS", [30, web3.utils.toWei("0.5", "ether"), web3.utils.toWei("1", "ether"), 2], ["https://scontent-cdg2-1.xx.fbcdn.net/v/t31.18172-8/12697278_1009532165788640_4159217376855973243_o.jpg?stp=dst-jpg_p320x320&_nc_cat=100&ccb=1-6&_nc_sid=e3f864&_nc_ohc=tcvtZgImeOEAX8PlsMc&_nc_ht=scontent-cdg2-1.xx&oh=00_AT-O5GKYWeq-BYGbpkib6zPAoZqpVyBzodJ9lUh0-F2row&oe=629D54DE", "Le street artiste Toctoc, créatif et passionné, est à l’image de ses personnages : drôle et attachant.", "Arts",  "ipfs://QmfHqZdR8TTrspohWav6kgqbD5vwj5f289t28KPpat92Wo",".png"]).encodeABI();
    sendMintitTransaction(data, cAddress, privateKey1, txCount)

    
    // Create Other NFT collection
    txCount = await web3.eth.getTransactionCount(artist1);
    data = mintitMgr.methods.createMintitNFTCollection("THE META KONGZ", "DOSS", [10000, web3.utils.toWei("1", "ether"), web3.utils.toWei("2", "ether"), 2] ["https://lh3.googleusercontent.com/N2gH3NR0rAuMNMNqSUKLX-mD09ebWzel3D5AoTnta8eNN-VJ75YoeeNeKuKHXPsEVZpBc2L158QHbn-61hNZe9dX6Ri1Hco9qThN=h200", "Can you believe that you can change the world by pioneering a new utopia through the Meta Kongz Project? The world of 10,000 kongz is a multi-universe, and kongz exist everywhere. Would you like to change the world together?", "Arts", "ipfs://QmfHqZdR8TTrspohWav6kgqbD5vwj5f289t28KPpat92Wo",".png"]).encodeABI();
    sendMintitTransaction(data, cAddress, privateKey1, txCount)

    // Create Tyler Hobbs artist
    txCount = await web3.eth.getTransactionCount(artist2);
    data = mintitMgr.methods.setArtist("Tyler Hobbs", "I use programming to create artwork. From Austin, TX.").encodeABI();
    sendMintitTransaction(data, cAddress, privateKey2, txCount)


    // Create Incomplete Control  NFT collection
    txCount = await web3.eth.getTransactionCount(artist2);
    data = mintitMgr.methods.createMintitNFTCollection("Incomplete Control by Tyler Hobbs", "BLOCKS", [80, web3.utils.toWei("3", "ether"), web3.utils.toWei("4", "ether"), 2], ["https://lh3.googleusercontent.com/gI2OEGj-wAogAC56WZq8VsFJd0FPEwBkTXjklcmahNJDEDxVxT2YoGKtOEEemt9jclk-EMv1jeRFkfa98__C0zpJ0DULxvAelzv1=h200", "Incomplete Control is about letting go, allowing room for error and imperfection. It is a meditation on the relation between analogue and computational aesthetics. The output space is a continuous spectrum. Each iteration has its own character to discover and enjoy, if you are willing to give it the time.", "Music", "ipfs://QmfHqZdR8TTrspohWav6kgqbD5vwj5f289t28KPpat92Wo",".png"]).encodeABI();
    sendMintitTransaction(data, cAddress, privateKey2, txCount);

    // Set Collection 2 to whitelist
    let colArray = await  mintitMgr.methods.getCollectionArray().call({from:artist1});
    let mintitNFT = new web3.eth.Contract(MintitContract.abi, colArray[1]);
    txCount = await web3.eth.getTransactionCount(artist1);
    // white list from 01/05/2022 to 01/07/2022
    data = mintitNFT.methods.setCalendar([1, 1651428000, 1656698400]).encodeABI();
    sendMintitTransaction(data, colArray[1], privateKey1, txCount);
 
    // Set Collection 3 to Public Sale
    mintitNFT = new web3.eth.Contract(MintitContract.abi, colArray[2]);
    txCount = await web3.eth.getTransactionCount(artist2);
    // white list from 01/05/2022 to 01/07/2022
    data = mintitNFT.methods.setCalendar([3, 1651428000, 1656698400]).encodeABI();
    sendMintitTransaction(data, colArray[2], privateKey2, txCount);

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