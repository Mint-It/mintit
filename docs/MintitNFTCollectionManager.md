## `MintitNFTCollectionManager`

Give the ability to deploy a contract to manage ERC-721 tokens for an Artist.




### `createMintitNFTCollection(string _collectionName, string _collectionSymbol, uint256[] _intParams, string[] _strParams) → address collectionAddress` (external)

Deploy the ERC-721 Collection contract of the artist caller to be able to create NFTs later





### `getCollectionArray() → address[]` (public)

Return the list of collection addresses created






### `MintitNFTCollectionCreated(string _collectionName, address _collectionAddress, uint256 _timestamp)`

Event emitted each time a new NFT collection is created





