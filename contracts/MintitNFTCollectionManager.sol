// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

// importing the ERC-721 contract to deploy for an artist
import "./MintitNFTCollection.sol";
import "./Artists.sol";
import "./Users.sol";
import "./DeployNFTCollection.sol";

/** 
  * @title In Real Life NFT collection Manager
  * @author Geoffrey B. / Christophe B.
  * @notice Give the ability to deploy a contract to manage ERC-721 tokens for an Artist. S/O @Snow
  * @dev    If the contract is already deployed for an _artistName, it will revert.
  */
contract MintitNFTCollectionManager is Artists, Users{
    //using DeployNFTCollection for string;

    // Array of collection addresses
    address[] public collectionArray;

    /// @notice Event emitted each time a new NFT collection is created
    event MintitNFTCollectionCreated(string _collectionName, address _collectionAddress, uint _timestamp);

    /**
      * @notice Deploy the ERC-721 Collection contract of the artist caller to be able to create NFTs later
      *
      * @return collectionAddress the address of the created collection contract
      */
    function createMintitNFTCollectionn(string memory _collectionName, string memory _collectionSymbol) external returns (address collectionAddress) {
        // deploy NFT collection
        //collectionAddress = Create2.deploy(_collectionName, _collectionSymbol);
        collectionAddress = DeployNFTCollection.deployNFTCollection(_collectionName, _collectionSymbol, msg.sender);
        //collectionAddress = _collectionName.deployNFTCollection(_collectionSymbol, msg.sender);
        
        // create the artist if not exist
        if (artists[msg.sender].created == false) {
            setArtist(_collectionName, "");
        }
        artists[msg.sender].collections[collectionAddress] = MintitNFTCollection(collectionAddress);
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
