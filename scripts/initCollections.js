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
    data = mintitMgr.methods.createDetailledMintitNFTCollection("DUSS", "DUSS", 30, web3.utils.toWei("0.5", "ether"), web3.utils.toWei("1", "ether"), "https://scontent-cdg2-1.xx.fbcdn.net/v/t31.18172-8/12697278_1009532165788640_4159217376855973243_o.jpg?stp=dst-jpg_p320x320&_nc_cat=100&ccb=1-6&_nc_sid=e3f864&_nc_ohc=tcvtZgImeOEAX8PlsMc&_nc_ht=scontent-cdg2-1.xx&oh=00_AT-O5GKYWeq-BYGbpkib6zPAoZqpVyBzodJ9lUh0-F2row&oe=629D54DE", "Le street artiste Toctoc, créatif et passionné, est à l’image de ses personnages : drôle et attachant.", "Arts",  "ipfs://QmfHqZdR8TTrspohWav6kgqbD5vwj5f289t28KPpat92Wo",".png").encodeABI();
    sendMintitTransaction(data, cAddress, privateKey1, txCount)

    
    // Create Other NFT collection
    txCount = await web3.eth.getTransactionCount(artist1);
    data = mintitMgr.methods.createDetailledMintitNFTCollection("THE META KONGZ", "DOSS", 10000, web3.utils.toWei("1", "ether"), web3.utils.toWei("2", "ether"), "https://lh3.googleusercontent.com/N2gH3NR0rAuMNMNqSUKLX-mD09ebWzel3D5AoTnta8eNN-VJ75YoeeNeKuKHXPsEVZpBc2L158QHbn-61hNZe9dX6Ri1Hco9qThN=h200", "Can you believe that you can change the world by pioneering a new utopia through the Meta Kongz Project? The world of 10,000 kongz is a multi-universe, and kongz exist everywhere. Would you like to change the world together?", "Arts", "ipfs://QmfHqZdR8TTrspohWav6kgqbD5vwj5f289t28KPpat92Wo",".png").encodeABI();
    sendMintitTransaction(data, cAddress, privateKey1, txCount)


    // Create Tyler Hobbs artist
    txCount = await web3.eth.getTransactionCount(artist2);
    data = mintitMgr.methods.setArtist("Tyler Hobbs", "I use programming to create artwork. From Austin, TX.").encodeABI();
    sendMintitTransaction(data, cAddress, privateKey2, txCount)
    txCount = await web3.eth.getTransactionCount(artist2);
    
    // Create Incomplete Control  NFT collection
    txCount = await web3.eth.getTransactionCount(artist2);
    data = mintitMgr.methods.createDetailledMintitNFTCollection("Incomplete Control by Tyler Hobbs", "BLOCKS", 80, web3.utils.toWei("3", "ether"), web3.utils.toWei("4", "ether"), "https://lh3.googleusercontent.com/gI2OEGj-wAogAC56WZq8VsFJd0FPEwBkTXjklcmahNJDEDxVxT2YoGKtOEEemt9jclk-EMv1jeRFkfa98__C0zpJ0DULxvAelzv1=h200", "Incomplete Control is about letting go, allowing room for error and imperfection. It is a meditation on the relation between analogue and computational aesthetics. The output space is a continuous spectrum. Each iteration has its own character to discover and enjoy, if you are willing to give it the time.", "Music", "ipfs://QmfHqZdR8TTrspohWav6kgqbD5vwj5f289t28KPpat92Wo",".png").encodeABI();
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