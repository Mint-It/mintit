# MintIt

MintIt is a Decentralized Application allowing artists to create and manage their NFT collections without writing any code.

---

## Features

MintIt provides a web3 user interface for the creator to have a full control on their collection :

- Define all characteristics of the collection : name, symbol, description, banner, base URI and extension
- Define the price of the NFT during presale and sale
- Define the royalties that will be applied to the collection (ERC2981)
- Let the artist specify a precise calendar for every stages of the sale (white, presale, sale, reveal). If the artist wants to have a presale every monday in march, and then starts the sale in april, this is possible with MinitIt with just one transaction.

Also, MintIt provides a great interface for users to easily find all the collections using different filters. Finding the collections in the whitelist stage, or in the sale stage, can be done in one click.

MintIt is completely free to use for artists and collectors. The platform just take a 4% commission on every mint.

---

## MintIt advantages

MintIt is a fully optimized platform which reduces gas fees to the minimum. To achieve this goal, MintIt will deploy a NFT collection contract type for you. Then deploying a collection will just be deploying a proxy contract.
This simple proxy smart contract will be much cheap to deploy compared to a full NFT collection smart contract.

In addition, the artist will remain the only owner of the smart contract NFT deployed, giving him the full control of it.

---

## MintIt Design Patterns

The smart contract MintItNFTCollectionManager takes care of deploying new NFT collection smart contracts.

More details can be found in the [Design Patterns](docs/design_pattern_desicions.md) document.

---

## Security

Security has been a real concerned of the MintIt platform.

More details can be found in the [Avoiding common Attacks](docs/avoiding_common_attacks.md) document.

---

## MintIt Smart Contracts Installation

### Install and compile smart contracts

`npm install`

`truffle compile`

### Test smart contract

#### MintitNFTCollectionManager

`truffle test test/TestMintitNFTCollectionManager.js`

#### MintitNFTCollection

`truffle test test/TestMintitNFTCollection.js`

More details can be found in the [Tests Explanations](docs/tests_explication.md) document.

### Deploy smart contracts

#### Deploy on ganache

`truffle migrate --network develop`

#### Deploy on Kovan euthereum testnet

`truffle migrate --network kovan`

#### Deploy on Rinkeby euthereum testnet

`truffle migrate --network rinkeby`

### Useful scripts

- this script can be used to simplify testing : it will create 2 artists, will deploy 3 NFT collections with a different calendar, and several NFTs will be minted by 2 different users

`node scripts/initFullCollection.js`

- this script will allow to release all payments available in the NFT collection smart contracts, depending on the list of payees and their respective shares

`node scripts/releaseAll.js`

---

## Mintit dApp

### Install and launch

`cd client`

`npm install`

`npm run start`
