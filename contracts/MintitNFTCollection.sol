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

    struct Infos {
        string name;
        string symbol;
        string description;
        string banner;
        string baseURI;
        string baseExtension;
        string category;
        uint price;
        uint presalePrice;
        uint maxSupply;
        uint maxPerWallet;
    }

    Infos private collectionInfo;

   // merkle tree to check if address is in the private whitelist
    bytes32 private privateWL;

   // mapping to check if address is in the public whitelist
    mapping(address => bool) private publicWL;

    struct Arts{
      string description;
    }
    mapping(uint => Arts) private arts;

    mapping(address => uint) private nbWallet;

    // The different stages of selling the collection
    enum Stages {
        Config,
        PublicWhitelist,
        Presale,
        Sale,
        SoldOut,
        Reveal
    }

    struct Interval{
        uint start;
        uint end;
    }

    Stages public sellingStage;
    mapping(uint => Interval[]) private calendar;

    /**
      * @notice Constructor parameters of ERC721. Params will be set by Collection Manager
      */
    constructor(string memory name_, string memory symbol_, address _artist,
                uint _maxSupply, uint _presalePrice, uint _price,
                string memory _banner, string memory _description, string memory _category,
                string memory _newBaseURI, string memory _baseExtension) ERC721 (name_, symbol_) {
        sellingStage = Stages.Config;
        artistAddress = _artist;
        collectionInfo.maxSupply = _maxSupply;
        collectionInfo.maxPerWallet = 2;
        collectionInfo.presalePrice = _presalePrice;
        collectionInfo.category = _category;
        collectionInfo.price = _price;
        collectionInfo.banner = _banner;
        collectionInfo.description = _description;
        collectionInfo.baseURI = _newBaseURI;
        collectionInfo.baseExtension = _baseExtension;
        collectionInfo.name = name_;
        collectionInfo.symbol = symbol_;
    }

    /** 
    * @notice Allows to set dates for each sales
    *
    * @param dates Array containing the startand end dates of all stages
   **/
    function setCalendar(uint[] memory dates) external onlyArtist {
        require(getCurrentStage() == Stages.Config, "Should be in Config stage to change the dates.");
        require (dates.length % 3 == 0, "wrong date array");
        for (uint i = 0; i < 6; i++) {
            uint length = calendar[dates[i]].length;
            if (length > 0) {
                for (uint j = 0; j < length; j++)
                    calendar[dates[i]].pop();
            }
        }
        for (uint i = 0; i < dates.length; i+=3) {
            Interval memory interval;
            interval.start = dates[i+1];
            interval.end = dates[i+2];
            calendar[dates[i]].push(interval);
        }
    }

    /** 
    * @notice Allows to change the max supply during the config stage
    **/
    function setDetails(string memory _description, string memory _banner) external onlyArtist {
        collectionInfo.description = _description;
        collectionInfo.banner = _banner;
    }

    /** 
    * @notice Allows to change the max supply during the config stage
    **/
    function setMaxSupply(uint _amount) external onlyArtist {
        require(getCurrentStage() == Stages.Config, "Should be in Config stage to change the max supply.");
        collectionInfo.maxSupply = _amount;
    }

    /** 
    * @notice Allows to change the max supply during the config stage
    **/
    function setBaseURI(string memory __baseURI) external onlyArtist {
        require(getCurrentStage() == Stages.Config, "Should be in Config stage to change the base URI.");
        collectionInfo.baseURI = __baseURI;
    }

    /** 
    * @notice Allows to change the max supply during the config stage
    **/
    function setBaseExtension(string memory _baseExtension) external onlyArtist {
        require(getCurrentStage() == Stages.Config, "Should be in Config stage to change the base URI.");
        collectionInfo.baseExtension = _baseExtension;
    }

    /** 
    * @notice Allows to change the price of a NFT during the config stage
    **/
    function setPrice(uint _price) external onlyArtist {
        require(getCurrentStage() == Stages.Config, "Should be in Config stage to change the base URI.");
        collectionInfo.price = _price;
    }

    /** 
    * @notice Allows to change the price of a NFT during the config stage
    **/
    function setPresalePrice(uint _price) external onlyArtist {
        require(getCurrentStage() == Stages.Config, "Should be in Config stage to change the base URI.");
        collectionInfo.presalePrice = _price;
    }

    /**
    * @notice Set a new adresses white list 
    *
    * @param _newWhiteList The new Merkle Root
    **/
    function setPrivateWhitelist(bytes32 _newWhiteList) external onlyArtist {
        privateWL = _newWhiteList;
    }

    /**
    * @notice Add sender adress to the public white list 
    *
    **/
    function addPublicWhitelist() public {
        require(getCurrentStage() == Stages.PublicWhitelist, "Should be in WL stage.");
        require(publicWL[msg.sender] == true, "Sender already whitelisted");
        publicWL[msg.sender] = true;
    } 

    /** 
    * @notice Returns true if a leaf can be proved to be a part of a Merkle tree defined by root
    *
    * @param account Account to verify if private whitelisted
    * @param proof The Merkle Proof
    *
    * @return True if a account can be proved to be a part of the whiteList merkle tree
    **/
    function isPrivateWhiteListed(address account, bytes32[] calldata proof) internal view returns(bool) {
        return MerkleProof.verify(proof, privateWL, keccak256(abi.encodePacked(account)));
    }

    /**
    * @notice Return URI of the NFTs when revealed
    *
    * @return The URI of the NFTs when revealed
    **/
    function _baseURI() internal view virtual override returns (string memory) {
        return collectionInfo.baseURI;
    }

    /** 
    * @notice Allows to get details information of the NFT collection
    *
    * @return The infos of NFT collection
    **/
    function getCurrentStage() public view returns (Stages) {
        return (sellingStage);
    }

    /** 
    * @notice Allows to get details information of the NFT collection
    *
    * @return The infos of NFT collection
    **/
    function getCollectionInfos() external view returns (Infos memory) {
        return (collectionInfo);
    }

    /** 
    * @notice Allows to change the sellinStep to Presale
    **/
    function setUpPresale() external onlyArtist {
        require(getCurrentStage() == Stages.Config, "Should be in Config stage to go to Presale.");
        sellingStage = Stages.Presale;
    }

    /** 
    * @notice Allows to change the sellinStep to Sale
    **/
    function setUpSale() external onlyArtist {
        require(getCurrentStage() == Stages.Presale, "Should be in Presale stage to go to Sale.");
        sellingStage = Stages.Sale;
    }

    /**
    * @notice Allows to mint NFTs
    *
    * @return newItemId The Id of the minted NFT
    **/
    function PresaleMintArt(bytes32[] calldata _proof) external payable nonReentrant returns (uint256)
    {
        require(getCurrentStage() == Stages.Presale, "Presale has not started yet.");
        require(totalSupply() + 1 < collectionInfo.maxSupply, "All NFT are sold");
        require((isPrivateWhiteListed(msg.sender, _proof) || publicWL[msg.sender] == true), "Not on the whitelist");
        require(msg.value >= collectionInfo.presalePrice, "Not enought funds.");
        require(nbWallet[msg.sender] < collectionInfo.maxPerWallet, "Max number of mint reached");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        arts[newItemId].description = "";
        nbWallet[msg.sender] = nbWallet[msg.sender] + 1;
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
        require(getCurrentStage() == Stages.Sale, "Sale has not started yet.");
        require(totalSupply() + 1 < collectionInfo.maxSupply, "All NFT are sold");
        require(msg.value >= collectionInfo.price, "Not enought funds.");
        require(nbWallet[msg.sender] < collectionInfo.maxPerWallet, "Max number of mint reached");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        arts[newItemId].description = "";
        nbWallet[msg.sender] = nbWallet[msg.sender] + 1;
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
            ? string(abi.encodePacked(currentBaseURI, _nftId.toString(), collectionInfo.baseExtension))
            : "";
    }

    modifier onlyArtist() {
        require(_msgSender() == artistAddress, "Caller is not privileged");
        _;
    }
}