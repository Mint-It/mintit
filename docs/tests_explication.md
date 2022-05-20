# Explication des tests réalisés

## Test du smart contract MintitNFTCollectionManager.sol

### Create new NFT collection

Create a NFT collection and check that :

- the MintitNFTCollectionCreated event is emitted with correct collection name
- the artist is created and ArtistUpdated event is emitted

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

## Test du smart contract MintitNFTCollection.sol

### Create new NFT collection

Create a NFT collection and check that :

- the MintitNFTCollectionCreated event is emitted with correct collection name
- the artist is created and ArtistUpdated event is emitted

### Check created NFT collection

Check that the collection created has the name specified

### Set max supply should not be allowed for non owner

Check that only the owner of the smart contract can modify the supply

### Check collection params

Check that all collection parameters are correct

### Change max supply

Check that changing max supply woks for the cotnract owner

### Set royalties

Change royalties and check that the event UpdatedRoyalties is emitted with correct value

### Set calendar to whitelist and test whitelist

Set the calendar to the white list phase and verify that user can be added to whitelist

### Premint or mint a NFT should fail if Sale did not start yet

- Check mint fails from a user while not in sale stage
- Check that premint fails from a whitelisted user while not in the presale stage

### Mint a NFT in a presale should fail if not whitelisted

Check that premint fails from a not whitelisted user while in the presale stage

### Move to Sale and mint a NFT

Set a complex calendar and set it currently to the mintinig phase
Then mint a NFT and check that the Transfer event is emitted with the correct token id

### Mint a NFT should fail if sending less than the price

Mint a token with a price lower than the required price must fail

### Check user balance

Verify that user has 2 NFT in his balance

### Mint a NFT should fail as user already has 2 NFT

Verify that a user cannot mint more than the maximum number allowed per wallet

### Mint another NFT from another user

Mint another NFT fom another use to reach the max supply

### Mint another NFT should fail as max supply reached

Minting a NFT when the max supply is reached must fail