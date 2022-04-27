const IrlNFTCollectionManager = artifacts.require("IrlNFTCollectionManager");
const IrlNFTCollection = artifacts.require("IrlNFTCollection");
const truffleAssert = require('truffle-assertions');

contract("IrlNFTCollectionManager", accounts => {
    let irlMgtInstance;
    let irlNFTinstance;
    let collectionAddress;
    let ownerAddress = accounts[0];
    let address  = accounts[1];
    let artist = accounts[3];

    beforeEach(async () => {
        irlMgtInstance = await IrlNFTCollectionManager.deployed();
    })    

    it("...Create new NFT collection", async () => {
        let tx = await irlMgtInstance.createIrlNFTCollection("My duss", "DUSS", {from: artist });
        truffleAssert.eventEmitted(tx, 'IrlNFTCollectionCreated', (ev) => {
            collectionAddress = ev._collectionAddress;
            return ev._collectionName == "My duss";
        });
        truffleAssert.eventEmitted(tx, 'ArtistUpdated', (ev) => {
            return ev._artistAddress == artist && ev._artistName == "My duss" && ev._created == true;
        });
    });

    it("...Check that the Artist was created with the name of its first collection by default", async () => {
        let artistInstance = await irlMgtInstance.getArtistDetails(artist);
        assert.equal(artistInstance.name, "My duss", "Artist name should be set to My duss");
        assert.equal(artistInstance.verified, false, "Artist should not be verified by default");
    });

    it("...create a new artist", async () => {
        let tx = await irlMgtInstance.createArtist("TocToc", "Street Artist", {from: artist });
        truffleAssert.eventEmitted(tx, 'ArtistUpdated', (ev) => {
            return ev._artistAddress == artist && ev._artistName == "TocToc";
        });
    });

    it("...Check that the Artist was updated with the name specified", async () => {
        let artistInstance = await irlMgtInstance.getArtistDetails(artist);
        assert.equal(artistInstance.name, "TocToc", "Artist name should be set to My duss");
        assert.equal(artistInstance.description, "Street Artist", "Artist description should be set to Street Artist");
    });

    it("...verify a existing artist", async () => {
        let tx = await irlMgtInstance.verifyArtist(artist, true, {from: ownerAddress });
        let artistInstance = await irlMgtInstance.getArtistDetails(artist);
        assert.equal(artistInstance.verified, true, "Artist should be verified");
    });

    it("...check created NFT collection", async () => {
        irlNFTinstance = await IrlNFTCollection.at(collectionAddress);
        let name = await irlNFTinstance.name();
        assert.equal(name, "My duss", "Collection name should be set to My duss");
    });

    it("...check collection array retrieval", async () => {
        let collections = await irlMgtInstance.getCollectionArray();
        assert.equal(collections[0], collectionAddress, "Collection Array do not include collection created");
    });

    it("...check collection item retrieval", async () => {
        let colAddress = await irlMgtInstance.collectionArray(0);
        assert.equal(colAddress, collectionAddress, "Collection Array do not include collection created");
    });
});