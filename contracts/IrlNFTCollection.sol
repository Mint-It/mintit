// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/** 
  * @title In Real Life NFT collection
  * @author Geoffrey B. / Christophe B.
  * @notice NFT collection of an artist which may generate some action in real life
  * @dev    If the contract is already deployed for an _artistName, it will revert.
  */
contract IrlNFTCollection is ERC721Enumerable, Ownable, ReentrancyGuard {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Max number of NFT to be minted
    uint private maxSupply;

    // URI of the NFTs when revealed
    string private baseURI;
    //The extension of the file containing the Metadatas of the NFTs
    string private baseExtension = ".json";

    struct Arts{
        bool sendIrl;
        bool streetArt;
    }
    mapping(uint => Arts) private arts;

    // The different stages of selling the collection
    enum Stages {
        Config,
        Presale,
        Sale,
        SoldOut,
        Reveal
    }
    Stages public sellingStage;

    /**
      * @notice Constructor parameters of ERC721. Params will be set by Collection Manager
      */
    constructor(string memory name_, string memory symbol_) ERC721 (name_, symbol_) {
        sellingStage = Stages.Config;
    }

    /** 
    * @notice Allows to change the max supply during the config stage
    **/
    function setMaxSupply(uint _amount) external onlyOwner {
        require(sellingStage == Stages.Config, "Should be in Config stage to change the max supply.");
        maxSupply = _amount;
    }

    /** 
    * @notice Allows to change the max supply during the config stage
    **/
    function setBaseURI(string memory __baseURI) external onlyOwner {
        require(sellingStage == Stages.Config, "Should be in Config stage to change the base URI.");
        baseURI = __baseURI;
    }

    /** 
    * @notice Allows to change the max supply during the config stage
    **/
    function setBaseExtension(string memory _baseExtension) external onlyOwner {
        require(sellingStage == Stages.Config, "Should be in Config stage to change the base URI.");
        baseExtension = _baseExtension;
    }

    /**
    * @notice Return URI of the NFTs when revealed
    *
    * @return The URI of the NFTs when revealed
    **/
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    /** 
    * @notice Allows to change the sellinStep to Presale
    **/
    function setUpPresale() external onlyOwner {
        require(sellingStage == Stages.Config, "Should be in Config stage to go to Presale.");
        sellingStage = Stages.Presale;
    }

    /** 
    * @notice Allows to change the sellinStep to Sale
    **/
    function setUpSale() external onlyOwner {
        require(sellingStage == Stages.Presale, "Should be in Presale stage to go to Sale.");
        sellingStage = Stages.Sale;
    }

    /**
    * @notice Allows to mint NFTs
    *
    * @return newItemId The Id of the minted NFT
    **/
    function MintArt() external payable nonReentrant returns (uint256)
    {
        require(sellingStage == Stages.Sale, "Sale has not started yet.");
        require(totalSupply() + 1 < maxSupply, "All NFT are sold");
        _tokenIds.increment();
        uint randomNumber = random(100);
        uint256 newItemId = _tokenIds.current();
        arts[newItemId].sendIrl = false;
        arts[newItemId].streetArt = false;
        if (randomNumber < 3)
            arts[newItemId].streetArt = true;
        else if (randomNumber < 10)
            arts[newItemId].sendIrl = true;
        _safeMint(msg.sender, newItemId);

        return newItemId;
    }

    /**
    * @notice Allows to get the complete URI of a specific NFT by his ID
    *
    * @param _nftId The id of the NFT
    *
    * @return The token URI of the NFT which has _nftId Id
    **/
    function tokenURI(uint _nftId) public view override(ERC721) returns (string memory) {
        require(_exists(_nftId), "This NFT doesn't exist.");
        
        string memory currentBaseURI = _baseURI();
        return 
            bytes(currentBaseURI).length > 0 
            ? string(abi.encodePacked(currentBaseURI, _nftId.toString(), baseExtension))
            : "";
    }

    /**
    * @notice Calculate a Random number is a specified range
    *
    * @dev Should be temporary as better random calculation exists (Chainlink VRF) 
    *
    * @param number The max number
    *
    * @return uint representing the random value
    **/    
    function random(uint number) public view returns(uint){
        return uint(keccak256(abi.encodePacked(block.timestamp,block.difficulty,  
        msg.sender))) % number;
    }
}