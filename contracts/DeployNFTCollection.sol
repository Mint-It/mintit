// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

// importing the ERC-721 contract to deploy for an artist
import "./MintitNFTCollection.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

/** 
  * @title In Real Life NFT collection Deployment Library
  * @author Geoffrey B. / Christophe B.
  * @notice Used to deploy a new NFT collection with create2 function.
  * @dev    If the contract is already deployed for an _artistName, it will revert.
  */
library DeployNFTCollection {

    /**
      * @notice Deploy the ERC-721 Collection contract of the artist caller to be able to create NFTs later
      *
      * @return collectionAddress the address of the created collection contract
      */
    function deployNFTCollection(string memory _collectionName, string memory _collectionSymbol, address _owner,
                                        uint _maxSupply, uint _presalePrice, uint _price,
                                        string memory _banner, string memory _description, string memory _category,
                                        string memory _newBaseURI, string memory _baseExtension) external returns (address collectionAddress) {

        // Import the bytecode of the contract to deploy
        bytes memory collectionBytecode = abi.encodePacked(type(MintitNFTCollection).creationCode, 
                                            abi.encode(_collectionName, _collectionSymbol, _owner,
                                                        _maxSupply, _presalePrice, _price, _banner, _description,
                                                        _category, _newBaseURI, _baseExtension));
		// Make a random salt based on the artist name
        bytes32 salt = keccak256(abi.encodePacked(_collectionName));

        collectionAddress = Create2.deploy(0, salt, collectionBytecode);

        return collectionAddress;
    }}