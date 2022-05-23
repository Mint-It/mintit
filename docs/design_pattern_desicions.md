# Design pattern (in progress)

-   [Smart Contracts](#contracts)
    -   [MintitNFTCollectionManager](#MintitNFTCollectionManager)
    -   [DeployNFTCollection](#DeployNFTCollection)
    -   [MintitNFTCollection](#MintitNFTCollection)
-   [Use cases](#usecases)
    -   [Create collection](#createcollection)
    -   [Collection interactions](#collectioninteractions)
-   [Tools & dApp](#tools&dapp)

# Smart Contracts <a name="contracts"></a>

Several Smart Contracts have been created for the needs of the project.

<p align="center" >
    <img width="600" src="./assets/Mintit.global_contracts.png"></img>
</p>

## MintitNFTCollectionManager <a name="MintitNFTCollectionManager"></a>

This Smart Contract allows to get the list of collections and to create a collection (calls the smart contract deployNFTCollection)<br/>
2 other smart counteracts are also included (Artists and Users) to return the list of artists, the artist's info and the addresses of the artist's collections.

## DeployNFTCollection <a name="DeployNFTCollection"></a>

Contains the function to deploy a collection.<br/>
Import the bytecode of the contract to deploy.

## MintitNFTCollection <a name="MintitNFTCollection"></a>

This Smart Contract is dynamically deployed for each NFT Collection.<br/>
Inherits from :
- ERC721Enumerable : ERC721 is standard interface for non-fungible tokens.
- ERC2981Collection : The artist can set royalties.
- ReentrancyGuard : A modifier that can prevent reentrancy during certain functions.
- PaymentSplitter : Help to transfer the amount of Ether according to the percentage of the total shares.
- Ownable : The artist is the owner of the contract and is allowed to call some functions.

# Use cases <a name="usecases"></a>

## Create collection <a name="createcollection"></a>

<p align="center" >
    <img width="600" src="./assets/Mintit.artists.png"></img>
</p>

## Collection interactions <a name="collectioninteractions"></a>

<p align="center" >
    <img width="600" src="./assets/Mintit.collection.png"></img>
</p>

# Tools & dApp <a name="tools&dapp"></a>

We use Truffle to deploy smart contracts.<br/>
Ganache is used for development/testing of smart contracts but the beta will be deployed on the Kovan test blockchain so that users can test the application.<br/><br/>

The dApp is built with the React framework and web3.js (Ethereum JavaScript API).<br/>
To design the UI of the application we use Tailwind CSS.<br/>
The dApp is deployed on heroku : https://mintit.herokuapp.com/