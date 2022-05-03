// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

/** 
  * @title MintIt Users smart contract
  * @author Geoffrey B. / Christophe B.
  * @notice Users contract to manage User informations
  */
contract Users {

    struct user {
      string name;
      string description;
      bool created;
    }
    mapping(address => user) private users;

    /// @notice Event emitted each time a new user is created or updated
    event UserUpdated(bool _created, string _userName, address _userAddress);

    /**
      * @notice Create or update a user
      */
    function setUser(string memory _userName, string memory _userDescription) public  {
        require(bytes(_userName).length > 0, "user name cannot be empty");
        users[msg.sender].name = _userName;
        users[msg.sender].description = _userDescription;

        if (users[msg.sender].created == false) {
          users[msg.sender].created = true;
          emit UserUpdated(true, _userName, msg.sender);
        }
        else
          emit UserUpdated(false, _userName, msg.sender);
    }    

    /**
      * @notice Return the details of a user based on its address
      *
      * @return name of the user
      * @return description of the user
      */    
    function getUserDetails(address userAddress) public view returns (string memory name, string memory description) {
        return (users[userAddress].name, users[userAddress].description);
    }
}
