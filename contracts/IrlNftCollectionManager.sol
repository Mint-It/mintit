// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

// importing the ERC-721 contract to deploy for an artist
import "./IrlNFTCollection.sol";

/** 
  * @title In Real Life NFT collection Manager
  * @author Geoffrey Bernicot / Christophe Burgalat
  * @notice Give the ability to deploy a contract to manage ERC-721 tokens for an Artist. S/O @Snow
  * @dev    If the contract is already deployed for an _artistName, it will revert.
  */
contract IrlNFTCollectionManager{

    /// @notice Event emitted each time a new NFT collection is created
    event IrlNFTCollectionCreated(string _artistName, address _collectionAddress, uint _timestamp);

    /**
      * @notice Generate the contract bytecode including constructor parameters
      *
      * @return bytecode of the contract
      */
    function getCreationBytecode(string memory _artistName, string memory _artistSymbol) public pure returns (bytes memory) {
        bytes memory bytecode = type(IrlNFTCollection).creationCode;

        return abi.encodePacked(bytecode, abi.encode(_artistName, _artistSymbol));
    }

    /**
      * @notice Deploy the ERC-721 Collection contract of the artist caller to be able to create NFTs later
      *
      * @return collectionAddress the address of the created collection contract
      */
    function createIrlNFTCollection(string memory _artistName, string memory _artistSymbol) external returns (address collectionAddress) {
        // Import the bytecode of the contract to deploy
        bytes memory collectionBytecode = getCreationBytecode(_artistName, _artistSymbol);
				// Make a random salt based on the artist name
        bytes32 salt = keccak256(abi.encodePacked(_artistName));

        assembly {
            collectionAddress := create2(0, add(collectionBytecode, 0x20), mload(collectionBytecode), salt)
            if iszero(extcodesize(collectionAddress)) {
                // revert if something gone wrong (collectionAddress doesn't contain an address)
                revert(0, 0)
            }
        }
        // Initialize the collection contract with the artist settings
        //IrlNFTCollection(collectionAddress).initialize(msg.sender);

        emit IrlNFTCollectionCreated(_artistName, collectionAddress, block.timestamp);
    }
}
