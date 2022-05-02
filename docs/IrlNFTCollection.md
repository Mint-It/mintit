## `IrlNFTCollection`

NFT collection of an artist which may generate some action in real life


   If the contract is already deployed for an _artistName, it will revert.


### `constructor(string name_, string symbol_)` (public)

Constructor parameters of ERC721. Params will be set by Collection Manager



### `setMaxSupply(uint256 _amount)` (external)

Allows to change the max supply during the config stage




### `getMaxSupply() → uint256` (external)

Allows to change the max supply during the config stage





### `setBaseURI(string __baseURI)` (external)

Allows to change the max supply during the config stage




### `setBaseExtension(string _baseExtension)` (external)

Allows to change the max supply during the config stage




### `setPrice(uint256 _price)` (external)

Allows to change the price of a NFT during the config stage




### `getPrice() → uint256` (external)

Allows to change the max supply during the config stage





### `_baseURI() → string` (internal)

Return URI of the NFTs when revealed





### `setUpPresale()` (external)

Allows to change the sellinStep to Presale




### `setUpSale()` (external)

Allows to change the sellinStep to Sale




### `MintArt() → uint256` (external)

Allows to mint NFTs





### `tokenURI(uint256 _nftId) → string` (public)

Allows to get the complete URI of a specific NFT by his ID





### `random(uint256 number) → uint256` (public)

Calculate a Random number is a specified range



Should be temporary as better random calculation exists (Chainlink VRF) 





### `Arts`


bool sendIrl


bool streetArt



### `Stages`

















