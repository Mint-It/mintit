// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

// importing the ERC-721 contract to deploy for an artist
import "./Artists.sol";
import "./Users.sol";
import "./DeployNFTCollection.sol";
import "./DeployBaseCollection.sol";

/** 
  * @title Mint It NFT collection Manager
  * @author Geoffrey B. / Christophe B.
  * @notice Give the ability to deploy a contract to manage ERC-721 tokens for an Artist.
  */
contract MintitNFTCollectionManager is Artists, Users{

    // Array of collection addresses
    address[] public collectionArray;

    address mintitCollection;

    /// @notice Event emitted each time a new NFT collection is created
    event MintitNFTCollectionCreated(string _collectionName, address _collectionAddress, uint _timestamp);

    /**
      * @notice Deploy the ERC-721 Base NFT Collection contract
      *
      * @return mintitCollection the address of the created base NFT collection contract
      */
    function createMintitBaseCollection() external returns (address) {

        if (mintitCollection == address(0))
          mintitCollection = DeployBaseCollection.deployBaseCollection();

        return mintitCollection;
    }

    /**
      * @notice Deploy the Proxy MintIt smart contract which will delegate calls to the Base NFT Collection contracts
      *
      * @return collectionAddress the address of the created collection proxy contract
      */
    function createMintitNFTCollection(string memory _collectionName, string memory _collectionSymbol, 
                                        uint256[] memory _intParams, string[] memory _strParams) external returns (address collectionAddress) {

        if (mintitCollection == address(0))
          mintitCollection = DeployBaseCollection.deployBaseCollection();

        // deploy NFT collection
        collectionAddress = DeployNFTCollection.deployNFTCollection(_collectionName, _collectionSymbol, msg.sender,
                                _intParams,_strParams, mintitCollection);
        
        // create the artist if not exist
        if (artists[msg.sender].created == false) {
            setArtist(_collectionName, "");
        }
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
