// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

// importing the ERC-721 contract to deploy for an artist
import "./MintitNFTCollection.sol";
import "./Artists.sol";
import "./Users.sol";
import "./DeployNFTCollection.sol";

/** 
  * @title Mint It NFT collection Manager
  * @author Geoffrey B. / Christophe B.
  * @notice Give the ability to deploy a contract to manage ERC-721 tokens for an Artist.
  * @dev    If the contract is already deployed for an _collectionName, it will revert.
  */
contract MintitNFTCollectionManager is Artists, Users{

    // Array of collection addresses
    address[] public collectionArray;

    /// @notice Event emitted each time a new NFT collection is created
    event MintitNFTCollectionCreated(string _collectionName, address _collectionAddress, uint _timestamp);

    /**
      * @notice Deploy the ERC-721 Collection contract of the artist caller to be able to create NFTs later
      *
      * @return collectionAddress the address of the created collection contract
      */
    function createMintitNFTCollection(string memory _collectionName, string memory _collectionSymbol) external returns (address collectionAddress) {
        // deploy NFT collection
        collectionAddress = DeployNFTCollection.deployNFTCollection(_collectionName, _collectionSymbol, msg.sender,
                                                  0, 0, 0, "", "", "", "", "");
        
        // create the artist if not exist
        if (artists[msg.sender].created == false) {
            setArtist(_collectionName, "");
        }
        //artists[msg.sender].collections[collectionAddress] = MintitNFTCollection(collectionAddress);
        artists[msg.sender].collections.push(collectionAddress);
        collectionArray.push(collectionAddress);

        emit MintitNFTCollectionCreated(_collectionName, collectionAddress, block.timestamp);
    }

    /**
      * @notice Deploy the ERC-721 Collection contract of the artist caller to be able to create NFTs later
      *
      * @return collectionAddress the address of the created collection contract
      */
    function createDetailledMintitNFTCollection(string memory _collectionName, string memory _collectionSymbol, 
                                        uint _maxSupply, uint _presalePrice, uint _price,
                                        string memory _banner, string memory _description, string memory _category,
                                        string memory _newBaseURI, string memory _baseExtension) external returns (address collectionAddress) {
        // deploy NFT collection
        collectionAddress = DeployNFTCollection.deployNFTCollection(_collectionName, _collectionSymbol, msg.sender,
                                _maxSupply, _presalePrice, _price, _banner, _description, _category,
                                _newBaseURI, _baseExtension);
        
        // create the artist if not exist
        if (artists[msg.sender].created == false) {
            setArtist(_collectionName, "");
        }
        //MintitNFTCollection collection = MintitNFTCollection(collectionAddress);
        artists[msg.sender].collections.push(collectionAddress);
        collectionArray.push(collectionAddress);

        emit MintitNFTCollectionCreated(_collectionName, collectionAddress, block.timestamp);
    }

    /**
      * @notice Return the list of collection addresses created
      *
      * @return collectionArray the array of collection addresses
      */    
    function getCollectionArray() public view returns( address  [] memory){
        return collectionArray;
    }
}
