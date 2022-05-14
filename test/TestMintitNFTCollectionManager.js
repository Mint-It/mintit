const MintitNFTCollectionManager = artifacts.require("MintitNFTCollectionManager");
const MintitNFTCollection = artifacts.require("MintitNFTCollection");
const truffleAssert = require('truffle-assertions');

contract("MintitNFTCollectionManager", accounts => {
    let mintitMgtInstance;
    let mintitNFTinstance;
    let collectionAddress;
    let ownerAddress = accounts[0];
    let address  = accounts[1];
    let artist = accounts[2];
    let user = accounts[3];

    beforeEach(async () => {
        mintitMgtInstance = await MintitNFTCollectionManager.deployed();
    })    

    it("...Create new NFT collection", async () => {
        let tx = await mintitMgtInstance.createMintitNFTCollection("DUSS", "TUSS",
                                            [10000, 1000000, 2000000, 2], ["http://", "description", "Arts",
                                            "http://ssssssss", ".json"], {from: artist });
        truffleAssert.eventEmitted(tx, 'MintitNFTCollectionCreated', (ev) => {
            collectionAddress = ev._collectionAddress;
            return ev._collectionName == "DUSS";
        });
        truffleAssert.eventEmitted(tx, 'ArtistUpdated', (ev) => {
            return ev._artistAddress == artist && ev._artistName == "DUSS" && ev._created == true;
        });
    });

    it("...Check that the Artist was created with the name of its first collection by default", async () => {
        let artistInstance = await mintitMgtInstance.getArtistDetails(artist);
        assert.equal(artistInstance.name, "DUSS", "Artist name should be set to DUSS");
        assert.equal(artistInstance.verified, false, "Artist should not be verified by default");
    });

    it("...create a new artist", async () => {
        let tx = await mintitMgtInstance.setArtist("TocToc", "Street Artist", {from: artist });
        truffleAssert.eventEmitted(tx, 'ArtistUpdated', (ev) => {
            return ev._artistAddress == artist && ev._artistName == "TocToc";
        });
    });

    it("...Check that the Artist was updated with the name specified", async () => {
        let artistInstance = await mintitMgtInstance.getArtistDetails(artist);
        assert.equal(artistInstance.name, "TocToc", "Artist name should be set to My duss");
        assert.equal(artistInstance.description, "Street Artist", "Artist description should be set to Street Artist");
    });

    it("...verify a existing artist", async () => {
        let tx = await mintitMgtInstance.verifyArtist(artist, true, {from: ownerAddress });
        let artistInstance = await mintitMgtInstance.getArtistDetails(artist);
        assert.equal(artistInstance.verified, true, "Artist should be verified");
    });

    it("...create a new user", async () => {
        let tx = await mintitMgtInstance.setUser("User1", "User1 description", {from: user });
        truffleAssert.eventEmitted(tx, 'UserUpdated', (ev) => {
            return ev._userAddress == user && ev._userName == "User1";
        });
    });

    it("...Check that the User was updated with the name specified", async () => {
        let userInstance = await mintitMgtInstance.getUserDetails(user);
        assert.equal(userInstance.name, "User1", "User name should be set to User1");
        assert.equal(userInstance.description, "User1 description", "User description should be set to User1 description");
    });

    it("...check created NFT collection", async () => {
        mintitNFTinstance = await MintitNFTCollection.at(collectionAddress);
        let name = await mintitNFTinstance.name();
        assert.equal(name, "DUSS", "Collection name should be set to My duss");
    });

    it("...check collection array retrieval", async () => {
        let collections = await mintitMgtInstance.getCollectionArray();
        assert.equal(collections[0], collectionAddress, "Collection Array do not include collection created");
    });

    it("...check collection item retrieval", async () => {
        let colAddress = await mintitMgtInstance.collectionArray(0);
        assert.equal(colAddress, collectionAddress, "Collection Array do not include collection created");
    });

    it("...Create new detailled NFT collection", async () => {
        let tx = await mintitMgtInstance.createMintitNFTCollection("Collection 2", "TUSS",
                                            [100, 1000000, 2000000, 5], ["http://", "description", "Arts",
                                            "http://ssssssss", ".json"], {from: artist });
        truffleAssert.eventEmitted(tx, 'MintitNFTCollectionCreated', (ev) => {
            collectionAddress = ev._collectionAddress;
            return ev._collectionName == "Collection 2";
        });
        //truffleAssert.eventEmitted(tx, 'ArtistUpdated', (ev) => {
        //    return ev._artistAddress == artist && ev._artistName == "My duss2" && ev._created == true;
        //});
    });    
});
