// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/** 
  * @title In Real Life NFT collection
  * @author Geoffrey Bernicot / Christophe Burgalat
  * @notice NFT collection of an artist which may generate some action in real life
  * @dev    If the contract is already deployed for an _artistName, it will revert.
  */
contract IrlNFTCollection is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string private artistName;
    string private artistSymbol;

    struct Arts{
        bool sendIrl;
        bool streetArt;
    }
    Arts[] private arts;   

    /**
      * @notice Constructor parameters of ERC721. Params will be set by Collection Manager
      */
    constructor(string memory name_, string memory symbol_) ERC721 (name_, symbol_) {}

    function MintArt(address _player, string memory _tokenURI, bool _sendIrl, bool _streetArt) public returns (uint256)
    {
        _tokenIds.increment();
		    arts.push(Arts(_sendIrl, _streetArt));
        uint256 newItemId = _tokenIds.current();
        _mint(_player, newItemId);
        _setTokenURI(newItemId, _tokenURI);
 
        return newItemId;
    }
}