// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";

/** 
  * @title MintIt Artists smart contract
  * @author Geoffrey B. / Christophe B.
  * @notice Artists contract to manage Artists informations
  */
contract Artists is Ownable{

    // structure to store artists informations
    struct artist {
      string name;
      string description;
      bool created;
      bool verified;
      address[] collections;
    }
    mapping(address => artist) internal artists;
    // Array of artist addresses
    address[] public artistArray;

    /// @notice Event emitted each time a new artist is created or updated
    event ArtistUpdated(bool _created, string _artistName, address _artistAddress);

    /**
      * @notice Create or update an artist
      */
    function setArtist(string memory _artistName, string memory _artistDescription) public  {
        require(bytes(_artistName).length > 0, "artist name cannot be empty");
        artists[msg.sender].name = _artistName;
        artists[msg.sender].description = _artistDescription;

        if (artists[msg.sender].created == false) {
          artists[msg.sender].created = true;
          artistArray.push(msg.sender);
          emit ArtistUpdated(true, _artistName, msg.sender);
        }
        else
          emit ArtistUpdated(false, _artistName, msg.sender);
    }
    
    /**
      * @notice Verify or Unverify an existing artist
      */
    function verifyArtist(address _artist, bool _verified) public onlyOwner {
        require(artists[_artist].created == true, "artist does not exists");
        artists[_artist].verified = _verified;
    }

    /**
      * @notice Return the list of artist addresses created
      *
      * @return artistArray the array of artis addresses
      */    
    function getArtistArray() public view returns( address  [] memory){
        return artistArray;
    }

    /**
      * @notice Return the details of an artist based on its address
      *
      * @return name of the artist
      * @return description of the artist
      * @return verified information about the artist
      */    
    function getArtistDetails(address artistAddress) public view returns (string memory name, string memory description, bool verified, address[] memory collections) {
        return (artists[artistAddress].name, artists[artistAddress].description, artists[artistAddress].verified, artists[artistAddress].collections);
    }
}