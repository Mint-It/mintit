// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/** 
  * @title Mint It NFT collection
  * @author Geoffrey B. / Christophe B.
  * @notice NFT collection of an artist which may generate some action in real life
  * @dev    If the contract is already deployed for an _artistName, it will revert.
  */
contract MintitNFTCollection is ERC721Enumerable, ReentrancyGuard {
    using Strings for uint256;
    using Counters for Counters.Counter;
    address artistAddress;
    Counters.Counter private _tokenIds;

    // Max number of NFT to be minted
    uint private maxSupply;

    // Price of a NFT
    uint private price;
    // Price of a NFT in Presale
    uint private presalePrice;

    // description of the NFT collection
    string private description;

    // url to an image to represent the collection
    string private banner;

    // URI of the NFTs when revealed
    string private baseURI;
    //The extension of the file containing the Metadatas of the NFTs
    string private baseExtension = ".json";

   // merkle tree to check if address is in whitelist
    bytes32 private whiteList;

    struct Arts{
      string description;
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
    constructor(string memory name_, string memory symbol_, address _artist,
                uint _maxSupply, uint _presalePrice, uint _price,
                string memory _banner, string memory _description,
                string memory _newBaseURI, string memory _baseExtension) ERC721 (name_, symbol_) {
        sellingStage = Stages.Config;
        artistAddress = _artist;
        maxSupply = _maxSupply;
        presalePrice = _presalePrice;
        price = _price;
        banner = _banner;
        description = _description;
        baseURI = _newBaseURI;
        baseExtension = _baseExtension;
    }

    /** 
    * @notice Retrieve the description of the collection
    *
    * @return The description of the collection
    **/
    function getDescription() external view returns (string memory) {
        return description;
    }

    /** 
    * @notice Retrieve the image banner of the collection
    *
    * @return The image banner of the collection
    **/
    function getBanner() external view returns (string memory) {
        return banner;
    }

    /** 
    * @notice Allows to change the max supply during the config stage
    **/
    function setDetails(string memory _description, string memory _banner) external onlyArtist {
        description = _description;
        banner = _banner;
    }

    /** 
    * @notice Allows to retrieve the max supply of the collection
    *
    * @return The maximum number of NFT that can be supplied
    **/
    function getMaxSupply() external view returns (uint) {
        return maxSupply;
    }
    
    /** 
    * @notice Allows to change the max supply during the config stage
    **/
    function setMaxSupply(uint _amount) external onlyArtist {
        require(sellingStage == Stages.Config, "Should be in Config stage to change the max supply.");
        maxSupply = _amount;
    }

    /** 
    * @notice Allows to change the max supply during the config stage
    **/
    function setBaseURI(string memory __baseURI) external onlyArtist {
        require(sellingStage == Stages.Config, "Should be in Config stage to change the base URI.");
        baseURI = __baseURI;
    }

    /** 
    * @notice Allows to change the max supply during the config stage
    **/
    function setBaseExtension(string memory _baseExtension) external onlyArtist {
        require(sellingStage == Stages.Config, "Should be in Config stage to change the base URI.");
        baseExtension = _baseExtension;
    }

    /** 
    * @notice Allows to change the price of a NFT during the config stage
    **/
    function setPrice(uint _price) external onlyArtist {
        require(sellingStage == Stages.Config, "Should be in Config stage to change the base URI.");
        price = _price;
    }

    /** 
    * @notice Allows to change the price of the NFT during the config stage
    *
    * @return The price of NFT
    **/
    function getPrice() external view returns (uint) {
        return price;
    }

    /** 
    * @notice Allows to change the price of a NFT during the config stage
    **/
    function setPresalePrice(uint _price) external onlyArtist {
        require(sellingStage == Stages.Config, "Should be in Config stage to change the base URI.");
        presalePrice = _price;
    }

    /** 
    * @notice Allows to change the price of the NFT during the config stage
    *
    * @return The price of NFT
    **/
    function getPresalePrice() external view returns (uint) {
        return presalePrice;
    }

    /**
    * @notice Set a new adresses white list 
    *
    * @param _newWhiteList The new Merkle Root
    **/
    function setWhitelist(bytes32 _newWhiteList) external onlyArtist {
        whiteList = _newWhiteList;
    }
 
    /** 
    * @notice Returns true if a leaf can be proved to be a part of a Merkle tree defined by root
    *
    * @param account Account to verify if whitelisted
    * @param proof The Merkle Proof
    *
    * @return True if a account can be proved to be a part of the whiteList merkle tree
    **/
    function isWhiteListed(address account, bytes32[] calldata proof) internal view returns(bool) {
        return MerkleProof.verify(proof, whiteList, keccak256(abi.encodePacked(account)));
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
    function setUpPresale() external onlyArtist {
        require(sellingStage == Stages.Config, "Should be in Config stage to go to Presale.");
        sellingStage = Stages.Presale;
    }

    /** 
    * @notice Allows to change the sellinStep to Sale
    **/
    function setUpSale() external onlyArtist {
        require(sellingStage == Stages.Presale, "Should be in Presale stage to go to Sale.");
        sellingStage = Stages.Sale;
    }

    /**
    * @notice Allows to mint NFTs
    *
    * @return newItemId The Id of the minted NFT
    **/
    function PresaleMintArt(bytes32[] calldata _proof) external payable nonReentrant returns (uint256)
    {
        require(sellingStage == Stages.Presale, "Presale has not started yet.");
        require(totalSupply() + 1 < maxSupply, "All NFT are sold");
        require(isWhiteListed(msg.sender, _proof), "Not on the whitelist");
        require(msg.value >= presalePrice, "Not enought funds.");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        arts[newItemId].description = "";
        _safeMint(msg.sender, newItemId);

        return newItemId;
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
        require(msg.value >= price, "Not enought funds.");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        arts[newItemId].description = "";
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

    modifier onlyArtist() {
        require(_msgSender() == artistAddress, "Caller is not privileged");
        _;
    }
}