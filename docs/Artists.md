## `Artists`

Artists contract to manage Artists informations




### `setArtist(string _artistName, string _artistDescription)` (public)

Create or update an artist



### `verifyArtist(address _artist, bool _verified)` (public)

Verify or Unverify an existing artist



### `getArtistArray() → address[]` (public)

Return the list of artist addresses created





### `getArtistDetails(address artistAddress) → string name, string description, bool verified, address[] collections` (public)

Return the details of an artist based on its address






### `ArtistUpdated(bool _created, string _artistName, address _artistAddress)`

Event emitted each time a new artist is created or updated




### `artist`


string name


string description


bool created


bool verified


address[] collections



