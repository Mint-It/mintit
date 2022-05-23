## `MintitNFTCollection`

NFT collection of an artist which may generate some action in real life



### `callerIsUser()`






### `constructor(address[] _payees, uint256[] _shares, string name_, string symbol_, address _artist, uint256[] _intParams, string[] _strParams)` (public)

Constructor parameters of ERC721. Params will be set by Collection Manager



### `setCalendar(uint256[] dates)` (external)

Allows to set dates for each sales





### `getCalendar() → uint256[]` (public)

Returns Mint stages calendar array





### `getArtistAddress() → address` (public)

Returns the adress of the artist of the collection





### `setBanner(string _banner)` (external)

Allows to change the banner




### `setDescription(string _description)` (external)

Allows to change the description




### `setMaxSupply(uint256 _amount)` (external)

Allows to change the max supply during the config stage




### `setMaxNbPerWallet(uint256 _amount)` (external)

Allows to change the max supply during the config stage




### `setBaseURI(string __baseURI)` (external)

Allows to change the max supply during the config stage




### `setBaseExtension(string _baseExtension)` (external)

Allows to change the max supply during the config stage




### `setPrice(uint256 _price)` (external)

Allows to change the price of a NFT during the config stage




### `setPresalePrice(uint256 _price)` (external)

Allows to change the price of a NFT during the config stage




### `setPrivateWhitelist(bytes32 _newWhiteList)` (external)

Set a new adresses white list 





### `addPublicWhitelist()` (public)

Add sender adress to the public white list 





### `isPrivateWhiteListed(address account, bytes32[] proof) → bool` (internal)

Returns true if a leaf can be proved to be a part of a Merkle tree defined by root





### `isPublicWhiteListed(address account) → bool` (public)

Returns true if a address is whitelisted





### `_baseURI() → string` (internal)

Return URI of the NFTs when revealed





### `isStage(enum MintitNFTCollection.Stages stage) → bool` (internal)

check if the mint phase is the one provided in parameter





### `getCollectionInfos() → struct MintitNFTCollection.Infos` (external)

Allows to get details information of the NFT collection





### `setUpStage(enum MintitNFTCollection.Stages stage)` (external)

Allows to change the sellinStage value




### `PresaleMintArt(bytes32[] _proof) → uint256` (external)

Allows to mint NFTs





### `MintArt() → uint256` (external)

Allows to mint NFTs





### `tokenURI(uint256 _nftId) → string` (public)

Allows to get the complete URI of a specific NFT by his ID





### `releaseAll()` (external)

Send shares to all payee




### `setRoyaltyInfo(address _royaltyAddress, uint256 _percentage)` (public)

this will use internal functions to set EIP 2981
 found in IERC2981.sol and used by ERC2981Collections.sol





### `Whitelisted(address _userAddress)`

Event emitted each time a user get whitelisted



### `UpdatedRoyalties(address newRoyaltyAddress, uint256 newPercentage)`

Event emitted after royalties are updated




### `Infos`


string name


string symbol


string description


string banner


string baseURI


string baseExtension


string category


uint256 price


uint256 presalePrice


uint256 maxSupply


uint256 maxPerWallet


### `Arts`


string description


### `Interval`


uint256 start


uint256 end



### `Stages`




















