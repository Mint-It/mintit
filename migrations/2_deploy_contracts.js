var IrlNFTCollectionManager = artifacts.require("./IrlNFTCollectionManager.sol");

module.exports = function(deployer) {
  deployer.deploy(IrlNFTCollectionManager);
};
