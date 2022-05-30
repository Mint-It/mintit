// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
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
abstract contract MintitNFTBaseCollection is Initializable, ERC2981Collection, PaymentSplitterUpgradeable, OwnableUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    address artistAddress;

   // merkle tree to check if address is in the private whitelist
    bytes32 internal privateWL;

   // mapping to check if address is in the public whitelist
    mapping(address => bool) internal publicWL;

    mapping(address => uint) internal nbWallet;

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
    function __MintitNFTBaseCollection_init(address[] memory _payees, uint256[] memory _shares, address _artist) public initializer {
        __PaymentSplitter_init(_payees, _shares);
        __Ownable_init();
        sellingStage = Stages.Config;
        artistAddress = _artist;
        teamLength = _payees.length;
        transferOwnership(_artist);
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
    * @notice Allows to change the sellinStage value
    **/
    function setUpStage(Stages stage) external onlyOwner {
        require(isStage(Stages(uint(stage) - 1)), "Should be in previous stage");
        sellingStage = stage;
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
}