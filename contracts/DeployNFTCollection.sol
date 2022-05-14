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
                                        uint[] memory _intParams, string[] memory _strParams) external returns (address collectionAddress) {


        uint size = 5;
        address[] memory team = new address[](size);
        team[0] = 0xbDB3242085e12A682fd7d3697225BFcf18191162;
        team[1] = 0x56c9417F818C996F0171468bBBcC8dc47F2bA1A8;
        team[2] = 0x15B445D2e9015C57652c47f491D100F13C924469;
        team[3] = 0x73Aed72d0DFb9d906845a7552b945bd566b64321;
        team[4] = _owner;
        uint256[] memory shares = new uint256[](size);
        shares[0] = 1;
        shares[1] = 1;
        shares[2] = 1;
        shares[3] = 1;
        shares[4] = 96;
        // Import the bytecode of the contract to deploy
        bytes memory collectionBytecode = abi.encodePacked(type(MintitNFTCollection).creationCode, 
                                            abi.encode(team, shares,
                                                        _collectionName, _collectionSymbol, _owner,
                                                        _intParams, _strParams));
		// Make a random salt based on the artist name
        bytes32 salt = keccak256(abi.encodePacked(_collectionName));

        collectionAddress = Create2.deploy(0, salt, collectionBytecode);

        return collectionAddress;
    }
}