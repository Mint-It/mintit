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
    })    

    it("...Create new NFT collection", async () => {
        //let tx = await mintitMgtInstance.createMintitNFTCollection("My duss", "DUSS", {from: artist });
        let tx = await mintitMgtInstance.createMintitNFTCollection("Incomplete Control", "BLOCKS", [80, web3.utils.toWei("3", "ether"), web3.utils.toWei("4", "ether"), 2], ["https://lh3.googleusercontent.com/gI2OEGj-wAogAC56WZq8VsFJd0FPEwBkTXjklcmahNJDEDxVxT2YoGKtOEEemt9jclk-EMv1jeRFkfa98__C0zpJ0DULxvAelzv1=h200", "Incomplete Control is about letting go, allowing room for error and imperfection. It is a meditation on the relation between analogue and computational aesthetics. The output space is a continuous spectrum. Each iteration has its own character to discover and enjoy, if you are willing to give it the time.", "Music", "ipfs://QmfHqZdR8TTrspohWav6kgqbD5vwj5f289t28KPpat92Wo",".png"], {from: artist });
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

    it("...check max supply", async () => {
        let supply = await mintitNFTinstance.getCollectionInfos();
        assert.equal(supply['maxSupply'], 80, "Supply should be set to 80");
    });

    it("...change max supply", async () => {
        await mintitNFTinstance.setMaxSupply(50, {from: artist });
        let supply = await mintitNFTinstance.getCollectionInfos();
        assert.equal(supply['maxSupply'], 50, "Supply should be set to 50");
    });

    it("...check calendar", async () => {
        let tx = await mintitNFTinstance.setCalendar([1, 1651960495, 1652133295], {from: artist });
        tx = await mintitNFTinstance.addPublicWhitelist({from: user });
        let result = await mintitNFTinstance.isPublicWhiteListed(user);
        assert.equal(result, true, "Should be in public Whitelist");
        //console.log(stage);
        //assert.equal(stage, true, "Should be stage Whitelist");
    });

    it("...mint a NFT should fail if Sale did not start yet", async () => {
        await truffleAssert.fails(mintitNFTinstance.MintArt({from: user }));
    });

    it("...Move to Whitelist", async () => {
        let nftId = await mintitNFTinstance.setUpStage(1, {from: artist });
        let stage = await mintitNFTinstance.sellingStage({from: user });
        assert.equal(stage, 1, "Should be stage Whitelist");
    });

    /*it("...Add user to Public Whitelist", async () => {
        let tx = await mintitNFTinstance.addPublicWhitelist({from: user });
        let result = await mintitNFTinstance.isPublicWhiteListed(user);
        assert.equal(result, true, "Should be in public Whitelist");
    });*/

    it("...Move to Presale", async () => {
        let nftId = await mintitNFTinstance.setUpStage(2, {from: artist });
        let stage = await mintitNFTinstance.sellingStage({from: user });
        assert.equal(stage, 2, "Should be stage Presale");
    });

    it("...mint a NFT in a presale should fail if not whitelisted", async () => {
        await truffleAssert.fails(mintitNFTinstance.PresaleMintArt([], {from: userNotWL, value: web3.utils.toWei("3", "ether") }));
    });

    it("...mint a NFT in a presale", async () => {
        let tx = await mintitNFTinstance.PresaleMintArt([], {from: user, value: web3.utils.toWei("3", "ether") });
        truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
            return ev.tokenId == 1;
        });
    });

    it("...Move to Sale", async () => {
        let nftId = await mintitNFTinstance.setUpStage(3, {from: artist });
        let stage = await mintitNFTinstance.sellingStage({from: user });
        assert.equal(stage, 3, "Should be stage Sale");
    });

    it("...mint a NFT should fail if sending less than the price", async () => {
        await truffleAssert.fails(mintitNFTinstance.MintArt({from: user, value: web3.utils.toWei("3", "ether") }));
    });

    it("...mint a NFT", async () => {
        let tx = await mintitNFTinstance.MintArt({from: user, value: web3.utils.toWei("4", "ether") });
        truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
            return ev.tokenId == 2;
        });
        //assert.equal(nftId, 1, "First mint should have id 1");
    });

    it("...check user balance", async () => {
        let nbNft = await mintitNFTinstance.balanceOf(user);
        assert.equal(nbNft, 2, "user should have 2 NFT");
    });


});
