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
        let tx = await mintitMgtInstance.createMintitNFTCollection("My duss", "DUSS", {from: artist });
        truffleAssert.eventEmitted(tx, 'MintitNFTCollectionCreated', (ev) => {
            collectionAddress = ev._collectionAddress;
            return ev._collectionName == "My duss";
        });
        truffleAssert.eventEmitted(tx, 'ArtistUpdated', (ev) => {
            return ev._artistAddress == artist && ev._artistName == "My duss" && ev._created == true;
        });
    });

    it("...check created NFT collection", async () => {
        mintitNFTinstance = await MintitNFTCollection.at(collectionAddress);
        let name = await mintitNFTinstance.name();
        assert.equal(name, "My duss", "Collection name should be set to My duss");
    });

    it("...set max supply should not be allowed for non owner", async () => {
        await truffleAssert.fails(mintitNFTinstance.setMaxSupply(50, {from: user }));
    });

    it("...set max supply", async () => {
        await mintitNFTinstance.setMaxSupply(50, {from: artist });
        let supply = await mintitNFTinstance.getCollectionInfos();
        assert.equal(supply['maxSupply'], 50, "Supply should be set to 50");
    });

    it("...mint a NFT should fail if Sale did not start yet", async () => {
        await truffleAssert.fails(mintitNFTinstance.MintArt({from: user }));
    });

    it("...Move to Presale", async () => {
        let nftId = await mintitNFTinstance.setUpPresale({from: artist });
        let stage = await mintitNFTinstance.sellingStage({from: user });
        assert.equal(stage, 1, "Should be stage Presale");
    });

    it("...Move to Sale", async () => {
        let nftId = await mintitNFTinstance.setUpSale({from: artist });
        let stage = await mintitNFTinstance.sellingStage({from: user });
        assert.equal(stage, 2, "Should be stage Sale");
    });

    it("...mint a NFT", async () => {
        let tx = await mintitNFTinstance.MintArt({from: user });
        truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
            return ev.tokenId == 1;
        });
        //assert.equal(nftId, 1, "First mint should have id 1");
    });

    it("...check user balance", async () => {
        let nbNft = await mintitNFTinstance.balanceOf(user);
        assert.equal(nbNft, 1, "user should have 1 NFT");
    });
});
