const IrlNFTCollectionManager = artifacts.require("IrlNFTCollectionManager");
const IrlNFTCollection = artifacts.require("IrlNFTCollection");
const truffleAssert = require('truffle-assertions');

contract("IrlNFTCollectionManager", accounts => {
    let irlMgtInstance;
    let irlNFTinstance;
    let collectionAddress;
    let ownerAddress = accounts[0];
    let address  = accounts[1];
    let artist = accounts[2];

    beforeEach(async () => {
        irlMgtInstance = await IrlNFTCollectionManager.deployed();
    })    

    it("...Create new NFT collection", async () => {
        let tx = await irlMgtInstance.createIrlNFTCollection("TocToc", "DUSS", {from: artist });
        truffleAssert.eventEmitted(tx, 'IrlNFTCollectionCreated', (ev) => {
            collectionAddress = ev._collectionAddress;
            return ev._artistName == "TocToc";
        });

    });

    it("...create a new artist", async () => {
        let tx = await irlMgtInstance.createArtist("TocToc", "Street Artist", {from: artist });
        truffleAssert.eventEmitted(tx, 'ArtistUpdated', (ev) => {
            return ev._artistAddress == artist && ev._artistName == "TocToc";
        });
    });

    it("...check created NFT collection", async () => {
        irlNFTinstance = await IrlNFTCollection.at(collectionAddress);
        let name = await irlNFTinstance.name();
        assert.equal(name, "TocToc", "Artist name should be set to TocToc");
    });

    it("...check collection array retrieval", async () => {
        let collections = await irlMgtInstance.getCollectionArray();
        assert.equal(collections[0], collectionAddress, "Collection Array do not include collection created");
    });

});