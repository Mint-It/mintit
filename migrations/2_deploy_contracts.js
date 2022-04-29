var IrlNFTCollectionManager = artifacts.require("./IrlNFTCollectionManager.sol");
var DeployNFTCollection = artifacts.require("DeployNFTCollection");

module.exports = function(deployer) {
  deployer.deploy(DeployNFTCollection);
  deployer.link(DeployNFTCollection, IrlNFTCollectionManager);
  deployer.deploy(IrlNFTCollectionManager);
  //deployer.deploy(IrlNFTCollectionManager);
};
