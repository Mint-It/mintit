var MintitNFTCollectionManager = artifacts.require("./MintitNFTCollectionManager.sol");
var DeployNFTCollection = artifacts.require("DeployNFTCollection");

module.exports = function(deployer) {
  deployer.deploy(DeployNFTCollection);
  deployer.link(DeployNFTCollection, MintitNFTCollectionManager);
  deployer.deploy(MintitNFTCollectionManager);
  //deployer.deploy(MintitNFTCollectionManager);
};
