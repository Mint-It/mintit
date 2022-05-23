## `Users`

Users contract to manage User informations




### `setUser(string _userName, string _userDescription)` (public)

Create or update a user



### `getUserDetails(address userAddress) → string name, string description` (public)

Return the details of a user based on its address






### `UserUpdated(bool _created, string _userName, address _userAddress)`

Event emitted each time a new user is created or updated




### `user`


string name


string description


bool created



