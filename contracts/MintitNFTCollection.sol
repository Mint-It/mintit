// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/finance/PaymentSplitterUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./eip/2981/ERC2981Collection.sol";

/** 
  * @title Mint It NFT collection
  * @author Geoffrey B. / Christophe B.
  * @notice NFT collection of an artist
  */
contract MintitNFTCollection is Initializable, ERC721EnumerableUpgradeable, ERC2981Collection, ReentrancyGuardUpgradeable, PaymentSplitterUpgradeable, OwnableUpgradeable {
    using StringsUpgradeable for uint256;
    using CountersUpgradeable for CountersUpgradeable.Counter;
    address artistAddress;
    CountersUpgradeable.Counter private _tokenIds;

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
    uint[] private calendarArray;
    uint private teamLength;

    /// @notice Event emitted each time a user get whitelisted
    event Whitelisted(address _userAddress);
    /// @notice Event emitted after royalties are updated
    event UpdatedRoyalties(address newRoyaltyAddress, uint256 newPercentage);
    /// @notice Event emitted after data are updated
    event UpdatedDatas(string dataType);

    /**
      * @notice Constructor parameters of ERC721. Params will be set by Collection Manager
      */
    function initialize(address[] memory _payees, uint256[] memory _shares,
                string memory name_, string memory symbol_, address _artist,
                uint256[] memory _intParams, string[] memory _strParams) public initializer {
        __ERC721_init(name_, symbol_);
        __PaymentSplitter_init(_payees, _shares);
        __Ownable_init();
        sellingStage = Stages.Config;
        artistAddress = _artist;
        collectionInfo.maxSupply = _intParams[0];
        collectionInfo.presalePrice = _intParams[1];
        collectionInfo.price = _intParams[2];
        collectionInfo.maxPerWallet = _intParams[3];
        collectionInfo.banner = _strParams[0];
        collectionInfo.description = _strParams[1];
        collectionInfo.category = _strParams[2];
        collectionInfo.baseURI = _strParams[3];
        collectionInfo.baseExtension = _strParams[4];
        collectionInfo.name = name_;
        collectionInfo.symbol = symbol_;
        teamLength = _payees.length;
        transferOwnership(_artist);
   }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721EnumerableUpgradeable, IERC165) returns (bool) {
        return ERC721EnumerableUpgradeable.supportsInterface(interfaceId);
    }

    /** 
    * @notice Allows to set dates for each sales
    *
    * @param dates Array containing the startand end dates of all stages
   **/
    function setCalendar(uint[] memory dates) external onlyOwner {
        require(isStage(Stages.Config), "Should be in Config stage to change the dates.");
        require (dates.length % 3 == 0, "wrong date array");
        for (uint i = 0; i < 6; i++) {
            uint length = calendar[i].length;
            if (length > 0) {
                for (uint j = 0; j < length; j++)
                    calendar[i].pop();
            }
        }
        for (uint i = 0; i < dates.length; i+=3) {
            Interval memory interval;
            interval.start = dates[i+1];
            interval.end = dates[i+2];
            calendar[dates[i]].push(interval);
        }
        calendarArray = dates;
        emit UpdatedDatas("Calendar");
    }

    /** 
    * @notice Returns Mint stages calendar array
    *
    * @return uint[] table containing calendar infromation
    **/
    function getCalendar() public view returns(uint[] memory) {
        return calendarArray;
    }

    /** 
    * @notice Returns the adress of the artist of the collection
    *
    * @return address of the artist
    **/
    function getArtistAddress() public view returns(address) {
        return artistAddress;
    }

    /** 
    * @notice Allows to change the banner
    **/
    function setBanner(string memory _banner) external onlyOwner {
        collectionInfo.banner = _banner;
        emit UpdatedDatas("Banner");
    }

    /** 
    * @notice Allows to change the description
    **/
    function setDescription(string memory _description) external onlyOwner {
        collectionInfo.description = _description;
        emit UpdatedDatas("Description");
    }

    /** 
    * @notice Allows to change the max supply during the config stage
    **/
    function setMaxSupply(uint _amount) external onlyOwner {
        require(isStage(Stages.Config), "Should be in Config stage to change the max supply.");
        collectionInfo.maxSupply = _amount;
        emit UpdatedDatas("Max supply");
    }

    /** 
    * @notice Allows to change the max supply during the config stage
    **/
    function setMaxNbPerWallet(uint _amount) external onlyOwner {
        require(isStage(Stages.Config), "Should be in Config stage to change the max supply.");
        collectionInfo.maxPerWallet = _amount;
        emit UpdatedDatas("Max wallet");
    }
    /** 
    * @notice Allows to change the max supply during the config stage
    **/
    function setBaseURI(string memory __baseURI) external onlyOwner {
        require(isStage(Stages.Config), "Should be in Config stage to change the base URI.");
        collectionInfo.baseURI = __baseURI;
        emit UpdatedDatas("Base URI");
    }

    /** 
    * @notice Allows to change the max supply during the config stage
    **/
    function setBaseExtension(string memory _baseExtension) external onlyOwner {
        require(isStage(Stages.Config), "Should be in Config stage to change the base URI.");
        collectionInfo.baseExtension = _baseExtension;
        emit UpdatedDatas("Base Extension");
    }

    /** 
    * @notice Allows to change the category during the config stage
    **/
    function setCategory(string memory _category) external onlyOwner {
        require(isStage(Stages.Config), "Should be in Config stage to change the category.");
        collectionInfo.category = _category;
        emit UpdatedDatas("Category");
    }

    /** 
    * @notice Allows to change the price of a NFT during the config stage
    **/
    function setPrice(uint _price) external onlyOwner {
        require(isStage(Stages.Config), "Should be in Config stage to change the base URI.");
        collectionInfo.price = _price;
        emit UpdatedDatas("Price");
    }

    /** 
    * @notice Allows to change the price of a NFT during the config stage
    **/
    function setPresalePrice(uint _price) external onlyOwner {
        require(isStage(Stages.Config), "Should be in Config stage to change the base URI.");
        collectionInfo.presalePrice = _price;
        emit UpdatedDatas("Presale Price");
    }

    /**
    * @notice Set a new adresses white list 
    *
    * @param _newWhiteList The new Merkle Root
    **/
    function setPrivateWhitelist(bytes32 _newWhiteList) external onlyOwner {
        privateWL = _newWhiteList;
    }

    /**
    * @notice Add sender adress to the public white list 
    *
    **/
    function addPublicWhitelist() public {
        require(isStage(Stages.PublicWhitelist), "Should be in WL stage.");
        require(publicWL[msg.sender] == false, "Sender already whitelisted");
        publicWL[msg.sender] = true;
        emit Whitelisted(msg.sender);
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
        return MerkleProofUpgradeable.verify(proof, privateWL, keccak256(abi.encodePacked(account)));
    }

    /** 
    * @notice Returns true if a address is whitelisted
    *
    * @param account Account to verify if public whitelisted
    *
    * @return True if a account is whitelisted for public sale
    **/
    function isPublicWhiteListed(address account) public view returns(bool) {
        return publicWL[account];
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
    * @notice check if the mint phase is the one provided in parameter
    *
    * @return a boolean
    **/
    function isStage(Stages stage) internal view returns (bool) {
        if (sellingStage == stage)
            return true;

        for (uint i=0; i<calendar[uint(stage)].length;i++) {
            if (block.timestamp > calendar[uint(stage)][i].start && block.timestamp < calendar[uint(stage)][i].end)
                return true;
        }
        return false;
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
    * @notice Allows to change the sellinStage value
    **/
    function setUpStage(Stages stage) external onlyOwner {
        require(isStage(Stages(uint(stage) - 1)), "Should be in previous stage");
        sellingStage = stage;
    }

    /**
    * @notice Allows to mint NFTs
    *
    * @return newItemId The Id of the minted NFT
    **/
    function PresaleMintArt(bytes32[] calldata _proof) external payable nonReentrant callerIsUser returns (uint256)
    {
        require(isStage(Stages.Presale), "Presale has not started yet.");
        require(totalSupply() < collectionInfo.maxSupply, "All NFT are sold");
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
    function MintArt() external payable nonReentrant callerIsUser returns (uint256)
    {
        require(isStage(Stages.Sale), "Sale has not started yet.");
        require(totalSupply() < collectionInfo.maxSupply, "All NFT are sold");
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
    function tokenURI(uint _nftId) public view override(ERC721Upgradeable) returns (string memory) {
        require(_exists(_nftId), "This NFT doesn't exist.");
        
        string memory currentBaseURI = _baseURI();
        return 
            bytes(currentBaseURI).length > 0 
            ? string(abi.encodePacked(currentBaseURI, _nftId.toString()))
            : "";
    }

    /**
    * @notice Send shares to all payee
    **/
    function releaseAll() external {
        for(uint i = 0 ; i < teamLength ; i++) {
            release(payable(payee(i)));
        }
    }

    /**
    * @notice this will use internal functions to set EIP 2981
    *  found in IERC2981.sol and used by ERC2981Collections.sol
    * @param _royaltyAddress - Address for all royalties to go to
    * @param _percentage - Precentage in whole number of comission
    *  of secondary sales
    **/
    function setRoyaltyInfo(address _royaltyAddress, uint256 _percentage) public onlyOwner {
        _setRoyalties(_royaltyAddress, _percentage);
        emit UpdatedRoyalties(_royaltyAddress, _percentage);
    }

    modifier callerIsUser() {
        require(tx.origin == msg.sender, "The caller is another contract");
        _;
    }
}