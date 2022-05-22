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
    let user = accounts[5];
    let userNotWL = accounts[4];

    beforeEach(async () => {
        mintitMgtInstance = await MintitNFTCollectionManager.deployed();
        await mintitMgtInstance.createMintitBaseCollection();
    })    

    it("...Create new NFT collection", async () => {
        //let tx = await mintitMgtInstance.createMintitNFTCollection("My duss", "DUSS", {from: artist });
        let tx = await mintitMgtInstance.createMintitNFTCollection("Incomplete Control", "BLOCKS", [80, web3.utils.toWei("3", "ether"), web3.utils.toWei("4", "ether"), 2], ["https://banner.jpg", "Description", "Music", "ipfs://QmfHqZdR8TTrspohWav6kgqbD5vwj5f289t28KPpat92Wo",".png"], {from: artist });
        truffleAssert.eventEmitted(tx, 'MintitNFTCollectionCreated', (ev) => {
            collectionAddress = ev._collectionAddress;
            return ev._collectionName == "Incomplete Control";
        });
        truffleAssert.eventEmitted(tx, 'ArtistUpdated', (ev) => {
            return ev._artistAddress == artist && ev._artistName == "Incomplete Control" && ev._created == true;
        });
    });

    it("...check created NFT collection", async () => {
        mintitNFTinstance = await MintitNFTCollection.at(collectionAddress);
        let name = await mintitNFTinstance.name();
        assert.equal(name, "Incomplete Control", "Collection name should be set to Incomplete Control");
    });

    it("...set max supply should not be allowed for non owner", async () => {
        await truffleAssert.fails(mintitNFTinstance.setMaxSupply(50, {from: user }));
    });

    it("...check collection params", async () => {
        let infos = await mintitNFTinstance.getCollectionInfos();
        assert.equal(infos['maxSupply'], 80, "Supply should be set to 80");
        assert.equal(infos['maxPerWallet'], 2, "Max per wallet should be set to 2");
        assert.equal(infos['presalePrice'], web3.utils.toWei("3", "ether"), "Price should be set to 3 ether");
        assert.equal(infos['price'], web3.utils.toWei("4", "ether"), "Price should be set to 3 ether");
        assert.equal(infos['description'], "Description", "Description not correct");
        assert.equal(infos['banner'], "https://banner.jpg", "Banner not correct");
        assert.equal(infos['category'], "Music", "Category not correct");
        assert.equal(infos['baseURI'], "ipfs://QmfHqZdR8TTrspohWav6kgqbD5vwj5f289t28KPpat92Wo", "baseURI not correct");
        assert.equal(infos['baseExtension'], ".png", "base extension not correct");
    });

    it("...change max supply", async () => {
        await mintitNFTinstance.setMaxSupply(3, {from: artist });
        let supply = await mintitNFTinstance.getCollectionInfos();
        assert.equal(supply['maxSupply'], 3, "Supply should be set to 50");
    });

    it("...set royalties", async () => {
        let tx = await mintitNFTinstance.setRoyaltyInfo(artist, 5, {from: artist });
        truffleAssert.eventEmitted(tx, 'UpdatedRoyalties', (ev) => {
            return ev.newPercentage == 5;
        });
    });

    it("...set calendar to whitelist and test whitelist", async () => {
        let tx = await mintitNFTinstance.setCalendar([1, parseInt(Date.now()/1000)-3600, parseInt(Date.now()/1000)+3600], {from: artist });
        tx = await mintitNFTinstance.addPublicWhitelist({from: user });
        let result = await mintitNFTinstance.isPublicWhiteListed(user);
        assert.equal(result, true, "Should be in public Whitelist");
    });

    it("...premint or mint a NFT should fail if Sale did not start yet", async () => {
        await truffleAssert.fails(mintitNFTinstance.MintArt({from: user }));
        await truffleAssert.fails(mintitNFTinstance.PresaleMintArt({from: user }));
    });


    it("...Move to Presale and mint a NFT in a presale", async () => {
        let tx = await mintitNFTinstance.setCalendar([1, parseInt(Date.now()/1000)-7200, parseInt(Date.now()/1000)-3600,
                                                      2, parseInt(Date.now()/1000)-3600, parseInt(Date.now()/1000)+3600], {from: artist });
        tx = await mintitNFTinstance.PresaleMintArt([], {from: user, value: web3.utils.toWei("3", "ether") });
        truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
            return ev.tokenId == 1;
        });
    });

    it("...mint a NFT in a presale should fail if not whitelisted", async () => {
        await truffleAssert.fails(mintitNFTinstance.PresaleMintArt([], {from: userNotWL, value: web3.utils.toWei("3", "ether") }));
    });

    it("...Move to Sale and in ta NFT", async () => {
        let tx = await mintitNFTinstance.setCalendar([1, parseInt(Date.now()/1000)-7200, parseInt(Date.now()/1000)-3600,
                                                      2, parseInt(Date.now()/1000)-3600, parseInt(Date.now()/1000)-2000,
                                                      3, parseInt(Date.now()/1000)-2000, parseInt(Date.now()/1000)+2000], {from: artist });


        tx = await mintitNFTinstance.MintArt({from: user, value: web3.utils.toWei("4", "ether") });
        truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
            return ev.tokenId == 2;
        });
    });

    it("...mint a NFT should fail if sending less than the price", async () => {
        await truffleAssert.fails(mintitNFTinstance.MintArt({from: user, value: web3.utils.toWei("3", "ether") }));
    });

    it("...check user balance", async () => {
        let nbNft = await mintitNFTinstance.balanceOf(user);
        assert.equal(nbNft, 2, "user should have 2 NFT");
    });

    it("...mint a NFT should fail as user already has 2 NFT", async () => {
        await truffleAssert.fails(mintitNFTinstance.MintArt({from: user, value: web3.utils.toWei("4", "ether") }));
    });

    it("...Mint another NFT from another user", async () => {
        tx = await mintitNFTinstance.MintArt({from: userNotWL, value: web3.utils.toWei("4", "ether") });
        truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
            return ev.tokenId == 3;
        });
    });

    it("...Mint another NFT should fail as max supply reached", async () => {
        await truffleAssert.fails(mintitNFTinstance.MintArt({from: userNotWL, value: web3.utils.toWei("4", "ether") }));
    });
});
