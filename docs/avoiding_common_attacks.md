# Avoiding common attacks

## Reentrancy

We use the nonReentrant modifier of the OpenZeppelin Smart Contract ReentrancyGuard to secure the mint function.

## Oracle Manipulation

We don't use Oracle in our smart contracts.

## Timestamp Dependence

We use timestamps to set the calendar of the stages but it is not critical for a NFT mint.

## Insecure Arithmetic

Does not concern our project.

## Denial of Service

Does not concern our project.

## Griefing

MintitNFTCollectionManager call a function of the DeployNFTCollection to deploy the collection but the only problem is that the collection is not deploy if not enough gas (No security breach)

## Force Feeding

Does not concern our project.

## Pull Payment

With the release function of the OpenZeppelin Smart Contract PaymentSplitter, we favour the pullpayment method.