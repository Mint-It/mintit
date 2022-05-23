## `DeployNFTCollection`

Used to deploy a new NFT collection with create2 function.


   If the contract is already deployed for an _artistName, it will revert.


### `deployNFTCollection(string _collectionName, string _collectionSymbol, address _owner, uint256[] _intParams, string[] _strParams) → address collectionAddress` (external)

Deploy the ERC-721 Collection contract of the artist caller to be able to create NFTs later








