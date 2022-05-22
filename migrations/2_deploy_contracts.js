var MintitNFTCollectionManager = artifacts.require("./MintitNFTCollectionManager.sol");
var DeployNFTCollection = artifacts.require("DeployNFTCollection");
var DeployBaseCollection = artifacts.require("DeployBaseCollection");

module.exports = function(deployer) {
  deployer.deploy(DeployNFTCollection);
  deployer.deploy(DeployBaseCollection);
  deployer.link(DeployBaseCollection, MintitNFTCollectionManager);
  deployer.link(DeployNFTCollection, MintitNFTCollectionManager);
  deployer.deploy(MintitNFTCollectionManager);
  //deployer.deploy(MintitNFTCollectionManager);
};
