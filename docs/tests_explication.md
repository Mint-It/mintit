# Explication des tests réalisés

## Test du smart contract MintitNFTCollectionManager.sol

### Create new NFT collection

Create a NFT collection and check that :

- the MintitNFTCollectionCreated event is emitted with correct collection name
- the artist is created and ArtistUpdated event is emited

### Check that the Artist was created with the name of its first collection by default

- Check that the Artist name correspond to the collection name (which is the default name of an artist)
- Check that the Artist is not verified by defaut. Verifying an artist should be a manual smart contract call done by the owner of the contract only

### Modify a new artist

Change the name and description of an artist and check that the event is emitted with the correct name of artist

### Check that the Artist was updated with the name specified

Call getArtistDetails and check that the name and description of artist was correctly modified

### Verify a existing artist

Call the verifyArtist method and check that the value is modified

### Create a new user

Create a new user and check that UserUpdated event is emitted with correct parameters

### Check that the User was updated with the name specified

Call getUserDetails method and check that name and description of the user corresponds

### Check created NFT collection

Retrieve the colleciton contract created and check the name corresponds

### Check collection array retrieval

Call getCollectionArray method and check that it contains the created collection

### Check collection item retrieval

Retrieve the first collection adress from the collectionArray and verify it corresponds to the created collection
