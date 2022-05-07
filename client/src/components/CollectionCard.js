import React from 'react';
import Web3 from "web3";
import MintitNFTCollection from "../contracts/MintitNFTCollection.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class CollectionCard extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        collectionInfos: {'name' : "", "description" : "", "maxSupply" : 0}
      };
    }

    componentDidMount = async () => {
      this.getCollection();
    };

    getCollection = async () => {
        const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.props.collectionAddress);
        const infosNft = await contractNFT.methods.getCollectionInfos().call({ from: this.props.parentState.currentAccount });
        this.setState({collectionInfos : infosNft});
    }

    getPrice() {
      const price = this.state.collectionInfos.price;
      return Web3.utils.fromWei(price, "ether");
    }

    render = () => {
      return (
      <div className="p-4 md:w-1/3" key={this.props.collectionAddress}>
        <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
          <img className="lg:h-48 md:h-36 w-full object-cover object-center" src={this.state.collectionInfos.banner} alt="blog" />
          <div className="p-6">
            <h1 className="title-font text-lg font-medium text-gray-900 mb-3">{this.state.collectionInfos.name}</h1>
            <p className="leading-relaxed mb-3">{this.state.collectionInfos.description}</p>
            <div className="flex items-center flex-wrap ">
              <a className="text-red-500 inline-flex items-center md:mb-2 lg:mb-0">View collection
                <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </a>
              <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                <svg className="w-4 h-4 mr-1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>{this.state.collectionInfos.maxSupply} NFTs
              </span>
              <span className="text-gray-400 inline-flex items-center leading-none text-sm">
                <FontAwesomeIcon icon="hand-holding-dollar" />&nbsp;{ Web3.utils.fromWei("10000000000000000") } ETH
              </span>
            </div>
          </div>
        </div>
      </div>
      )
    }

}

export default CollectionCard;