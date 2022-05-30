// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./eip/2981/ERC2981Collection.sol";
import "./MintitNFTBaseCollection.sol";

/** 
  * @title Mint It NFT collection
  * @author Geoffrey B. / Christophe B.
  * @notice NFT collection of an artist
  */
contract MintitNFTERC1155Collection is Initializable, ERC1155Upgradeable, MintitNFTBaseCollection, ReentrancyGuardUpgradeable {
    //using StringsUpgradeable for uint256;
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIds;

    struct Infos {
        string name;
        string symbol;
        string description;
        string banner;
        string category;
        uint price;
        uint presalePrice;
        uint maxSupply;
        uint maxPerWallet;
    }

    Infos private collectionInfo;

    /**
      * @notice Constructor parameters of ERC721. Params will be set by Collection Manager
      */
    function initialize(address[] memory _payees, uint256[] memory _shares,
                string memory name_, string memory symbol_, address _artist,
                uint256[] memory _intParams, string[] memory _strParams) public initializer {
        __ERC1155_init(_strParams[3]);
        __MintitNFTBaseCollection_init(_payees, _shares, _artist);
        collectionInfo.maxSupply = _intParams[0];
        collectionInfo.presalePrice = _intParams[1];
        collectionInfo.price = _intParams[2];
        collectionInfo.maxPerWallet = _intParams[3];
        collectionInfo.banner = _strParams[0];
        collectionInfo.description = _strParams[1];
        collectionInfo.category = _strParams[2];
        collectionInfo.name = name_;
        collectionInfo.symbol = symbol_;
   }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155Upgradeable, IERC165) returns (bool) {
        return ERC1155Upgradeable.supportsInterface(interfaceId);
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
    * @notice Allows to get details information of the NFT collection
    *
    * @return The infos of NFT collection
    **/
    function getCollectionInfos() external view returns (Infos memory) {
        return (collectionInfo);
    }

    /**
    * @notice Allows to mint NFTs
    *
    * @return newItemId The Id of the minted NFT
    **/
    function PresaleMintArt(bytes32[] calldata _proof) external payable nonReentrant callerIsUser returns (uint256)
    {
        require(isStage(Stages.Presale), "Presale has not started yet.");
        require(_tokenIds.current() < collectionInfo.maxSupply, "All NFT are sold");
        require((isPrivateWhiteListed(msg.sender, _proof) || publicWL[msg.sender] == true), "Not on the whitelist");
        require(msg.value >= collectionInfo.presalePrice, "Not enought funds.");
        require(nbWallet[msg.sender] < collectionInfo.maxPerWallet, "Max number of mint reached");
        _tokenIds.increment();
        nbWallet[msg.sender] = nbWallet[msg.sender] + 1;
        _mint(msg.sender, 1, 1, "");

        return 1;
    }
    /**
    * @notice Allows to mint NFTs
    *
    * @return newItemId The Id of the minted NFT
    **/
    function MintArt() external payable nonReentrant callerIsUser returns (uint256)
    {
        require(isStage(Stages.Sale), "Sale has not started yet.");
        require(_tokenIds.current() < collectionInfo.maxSupply, "All NFT are sold");
        require(msg.value >= collectionInfo.price, "Not enought funds.");
        require(nbWallet[msg.sender] < collectionInfo.maxPerWallet, "Max number of mint reached");
        _tokenIds.increment();
        nbWallet[msg.sender] = nbWallet[msg.sender] + 1;
        _mint(msg.sender, 1, 1, "");

        return 1;
    }

    modifier callerIsUser() {
        require(tx.origin == msg.sender, "The caller is another contract");
        _;
    }
}