// Collection.js
import React from 'react';
import Web3 from "web3";
import MintitNFTCollection from "../contracts/MintitNFTCollection.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NFTCard from './NFTCard';

class Collection extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        collectionInfos: {'name' : "", "description" : "", "maxSupply" : 0, "price": 0, "presalePrice" : 0, category : ""},
        collectionAddress: "",
        artistAddress: "",
        isConfig: false,
        isPublicWhitelist: false,
        isPrivateWhitelist: false,
        isPresale: false,
        isSale: false,
        isSoldout: false,
        iamWhitelisted: false,
        artistName: "",
        artistDescription: ""
      };
    }

    componentDidMount = async () => {
      this.getCollection();
      console.log("Address:" + this.state.collectionAddress);
    };

    getCollection = async () => {
      const { colAddress } = this.props.match.params;
      this.state.collectionAddress = colAddress;
      this.setState({collectionAddress : String(colAddress)});
      const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.state.collectionAddress);
      const infosNft = await contractNFT.methods.getCollectionInfos().call({ from: this.props.parentState.currentAccount });
      this.setState({collectionInfos : infosNft});
      this.setState({isConfig : await contractNFT.methods.isStage(0).call()});
      this.setState({isPublicWhitelist : await contractNFT.methods.isStage(1).call()});
      //this.setState({isPrivateWhitelist : await contractNFT.methods.isStage(2).call()});
      this.setState({isPresale : await contractNFT.methods.isStage(2).call()});
      this.setState({isSale : await contractNFT.methods.isStage(3).call()});
      this.setState({isSoldout : await contractNFT.methods.isStage(4).call()});
      this.setState({totalSupply : await contractNFT.methods.totalSupply().call()});
      this.setState({artistAddress : await contractNFT.methods.getArtistAddress().call()});
      const artistDatas = await this.props.parentState.contractNFTManager.methods.getArtistDetails(this.state.artistAddress).call({ from:  this.props.parentState.currentAccount });
      this.setState({artistName: artistDatas['name'], artistDescription: artistDatas['description']});
      if (this.state.isPublicWhitelist)
        this.setState({iamWhitelisted : await contractNFT.methods.isPublicWhiteListed(this.props.parentState.currentAccount).call({ from: this.props.parentState.currentAccount })});

    }

    addWhitelist() {
      const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.state.collectionAddress);
      contractNFT.methods.addPublicWhitelist().send({ from: this.props.parentState.currentAccount });
    }

    mint() {
      const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.state.collectionAddress);
      if (this.state.isPresale)
        contractNFT.methods.PresaleMintArt([]).send({from: this.props.parentState.currentAccount, value: this.state.collectionInfos.presalePrice });
      else if (this.state.isSale)
        contractNFT.methods.MintArt().send({from: this.props.parentState.currentAccount, value: this.state.collectionInfos.price });
    }

    renderSoon() {
      if (this.state.isConfig) {
        return (
          <section class="text-gray-600 body-font">
            <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Collection coming soon
            </h1>
          </section>
        )
      }
      else 
        return(
          <section class="text-gray-600 body-font">
          </section>
        )
    }

    renderPublicWhitelist () {
      if (this.state.isPublicWhitelist && !this.state.iamWhitelisted) {
        return (
          <section class="text-gray-600 body-font">
            <div class="container px-5 py-24 mx-auto">
              <div class="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto">
                <h1 class="flex-grow sm:pr-16 text-2xl font-medium title-font text-gray-900">Press Whitelist button if you want to have access to the Presale</h1>
                <button class="flex-shrink-0 text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg mt-10 sm:mt-0" onClick={() => this.addWhitelist()}>Add me to Whitelist</button>
              </div>
            </div>
          </section>
        )
      }
      else if (this.state.iamWhitelisted) {
        return (
          <section class="text-gray-600 body-font">
            <div class="container px-5 py-24 mx-auto">
              <div class="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto">
                <h1 class="flex-grow sm:pr-16 text-2xl font-medium title-font text-gray-900">You are already Whitelisted</h1>
                <button class="flex-shrink-0 text-gray-700 bg-gray-100 border-0 py-2 px-8 focus:outline-none rounded text-lg mt-10 sm:mt-0">Add me to Whitelist</button>
              </div>
            </div>
          </section> 
        )       
      }
      else 
        return(
          <section class="text-gray-600 body-font">
          </section>
        )
    }

    renderSale () {
      if ((this.state.isPresale && this.state.iamWhitelisted) || this.state.isSale) {
        let price = "";
        if (this.state.isSale)
          price = Web3.utils.fromWei(Web3.utils.toBN(this.state.collectionInfos.price));
        else
          price = Web3.utils.fromWei(Web3.utils.toBN(this.state.collectionInfos.presalePrice));

        return (
          <section class="text-gray-600 body-font">
            <div class="container px-5 py-24 mx-auto">
              <div class="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto">
                <h1 class="flex-grow sm:pr-16 text-2xl font-medium title-font text-gray-900">Mint a NFT</h1>
                <button class="flex-shrink-0 text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg mt-10 sm:mt-0" onClick={() => this.mint()}>Mint { price} ETH</button>
              </div>
            </div>
          </section>
        )
      }
      else if (this.state.isSale){
        return (
          <section class="text-gray-600 body-font">
            <div class="container px-5 py-24 mx-auto">
              <div class="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto">
                <h1 class="flex-grow sm:pr-16 text-2xl font-medium title-font text-gray-900">You are not Whitelisted</h1>
                <button class="flex-shrink-0 text-gray-700 bg-gray-100 border-0 py-2 px-8 focus:outline-none rounded text-lg mt-10 sm:mt-0">Mint</button>
              </div>
            </div>
          </section> 
        )       
      }
      else 
        return(
          <section class="text-gray-600 body-font">
          </section>
        )
    }

    renderNFTCollection () {
      if (this.state.isSoldout) {
        let items=[];
        let i;
        for (i=0;i<this.state.totalSupply;i++)
          items.push("NFT " + i);

        return (
          <section class="text-gray-600 body-font">
            <div class="container px-5 py-24 mx-auto">
              <div class="flex flex-col text-center w-full mb-20">
                <h1 class="text-2xl font-medium title-font mb-4 text-gray-900">Minted NFT</h1>
                <p class="lg:w-2/3 mx-auto leading-relaxed text-base"></p>
              </div>
              <div class="flex flex-wrap -m-4">
                {items.map((item, index) => (
                  <NFTCard parentState={this.props.parentState} collectionAddress={this.state.collectionAddress} key={index} tokenId={index}/>
                ))}
              </div>
            </div>
          </section>

        )
      }
      else 
        return(
          <section class="text-gray-600 body-font">
          </section>
        )
    }

    render() {
      let stageElement = "";
      if (this.state.isConfig)
        stageElement = this.renderSoon();
      if (this.state.isPublicWhitelist)
        stageElement += this.renderPublicWhitelist();
      return (
          <div>
            <section class="text-gray-600 body-font">
              <div class="container mx-auto flex px-5 py-5 md:flex-row flex-col items-center">
                <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
                  <img class="object-cover object-center rounded" alt="hero" src={this.state.collectionInfos.banner}  />
                </div>
                <div class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
                  <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">{this.state.collectionInfos.name}
                  <br />
                  by {this.state.artistName}
                    <br class="hidden lg:inline-block" />
                  </h1>
                  <p class="mb-8 leading-relaxed">{this.state.collectionInfos.description}</p>
                  <p class="mb-8 leading-relaxed">Supply {this.state.totalSupply} / {this.state.collectionInfos.maxSupply}
                  <br></br>
                  Presale Price : {Web3.utils.fromWei(Web3.utils.toBN(this.state.collectionInfos.presalePrice))} ETH
                  <br></br>
                  Sale Price : {Web3.utils.fromWei(Web3.utils.toBN(this.state.collectionInfos.price))} ETH
                  <br></br>
                  Max mint per wallet : {this.state.collectionInfos.maxPerWallet}
                  </p>
                  </div>
              </div>
            </section>
            {this.renderSoon()}
            {this.renderPublicWhitelist()}
            {this.renderSale()}
            {this.renderNFTCollection()}
          </div>
        )
    }
}

export default Collection;