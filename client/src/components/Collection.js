// Collection.js
import React from 'react';
import Web3 from "web3";
import MintitNFTCollection from "../contracts/MintitNFTCollection.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CollectionCard from './CollectionCard';

class Collection extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        collectionInfos: {'name' : "", "description" : "", "maxSupply" : 0, "price": 0, "category" : ""},
        collectionAddress: "",
        isConfig: false,
        isPublicWhitelist: false,
        isPrivateWhitelist: false,
        isPresale: false,
        isSale: false,
        isSoldout: false
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
      this.setState({isPrivateWhitelist : await contractNFT.methods.isStage(2).call()});
      this.setState({isPresale : await contractNFT.methods.isStage(3).call()});
      this.setState({isSale : await contractNFT.methods.isStage(4).call()});
      this.setState({isSoldout : await contractNFT.methods.isStage(5).call()});
    }

    renderSoon() {
      return (
        <section class="text-gray-600 body-font">
          <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Collection coming soon
          </h1>
        </section>
      )
    }
    renderPublicWhitelist() {
      return (
        <section class="text-gray-600 body-font">
          <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">public whitelist
          </h1>
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
                    <br class="hidden lg:inline-block" />
                  </h1>
                  <p class="mb-8 leading-relaxed">{this.state.collectionInfos.description}</p>
                  <div class="flex justify-center">
                    <button class="inline-flex text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg">Button</button>
                    <button class="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">Button</button>
                  </div>
                </div>
              </div>
            </section>
            {stageElement}
          </div>
        )
    }
}

export default Collection;