import React from 'react';
import Web3 from "web3";
import MintitNFTCollection from "../contracts/MintitNFTCollection.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom';

class CollectionCard extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        collectionInfos: {'name' : "", "description" : "", "maxSupply" : 0, "price": 0, "category" : ""},
        stage : -1,
        isConfig: false,
        isPublicWhitelist: false,
        isPrivateWhitelist: false,
        isPresale: false,
        isSale: false,
        isSoldout: false,
        isSelectedStage: [false, false, false, false, false],
        category : -1,
        categoryArray: [
          {id:-1, name:"All"},
          {id:0, name:"Arts"},
          {id:1, name:"Collectibles"},
          {id:2, name:"Music"},
          {id:3, name:"Photographie"},
          {id:4, name:"Sports"}
        ]
      };
    }

    componentDidMount = async () => {
      this.getCollection();
    };

    getCollection = async () => {
        const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.props.collectionAddress);
        const infosNft = await contractNFT.methods.getCollectionInfos().call({ from: this.props.parentState.currentAccount });
        this.setState({collectionInfos : infosNft});
        this.setState({stage : await contractNFT.methods.sellingStage().call({ from: this.props.parentState.currentAccount })});
        this.setState({isConfig : await contractNFT.methods.isStage(0).call()});
        this.setState({isPublicWhitelist : await contractNFT.methods.isStage(1).call()});
        //this.setState({isPrivateWhitelist : await contractNFT.methods.isStage(2).call()});
        this.setState({isPresale : await contractNFT.methods.isStage(2).call()});
        this.setState({isSale : await contractNFT.methods.isStage(3).call()});
        this.setState({isSoldout : await contractNFT.methods.isStage(4).call()});
        this.setState({isSelectedStage : [this.state.isConfig, this.state.isPublicWhitelist, this.state.isPresale, this.state.isSale, this.state.isSoldout]});
        console.log("Filter : " + this.props.filterStage + ":isSelected : " + this.state.isSelectedStage);
        this.state.categoryArray.forEach((cat) => {
            if (cat.name == this.state.collectionInfos.category) 
              this.setState({category: cat.id});
        });
    }

    renderCollection = () => {
      return (
      //<div  className="p-4 md:w-1/3" key={this.props.collectionAddress}>
        <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
          <img className="lg:h-48 md:h-36 w-full object-cover object-center" src={this.state.collectionInfos.banner} alt="blog" />
          <div className="p-6">
            <h1 className="title-font text-lg font-medium text-gray-900 mb-3">{this.state.collectionInfos.name}</h1>
            <p className="leading-relaxed mb-3">{this.state.collectionInfos.description}</p>
            <div className="flex items-center flex-wrap ">
            <NavLink to={'/explore/' + this.props.collectionAddress} className="text-red-500 inline-flex items-center md:mb-2 lg:mb-0">View collection <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg></NavLink>
              <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                <svg className="w-4 h-4 mr-1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>{this.state.collectionInfos.maxSupply} NFTs
              </span>
              <span className="text-gray-400 inline-flex items-center leading-none text-sm">
                <FontAwesomeIcon icon="hand-holding-dollar" />&nbsp;{ Web3.utils.fromWei(Web3.utils.toBN(this.state.collectionInfos.price)) } ETH
              </span>
            </div>
          </div>
        </div>
      //</div>
      )
    }

    render() {
      //const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.props.collectionAddress);
      //let isSelectedStage =  await contractNFT.methods.isStage(this.state.stage).call();

      return (
        <div  className={((this.props.filterStage == -1 || this.state.isSelectedStage[this.props.filterStage]) && (this.props.filterCategory == -1 || this.props.filterCategory == this.state.category)) ? "p-4 md:w-1/3" : ""} key={this.props.collectionAddress}>
        {((this.props.filterStage == -1 || this.state.isSelectedStage[this.props.filterStage]) && (this.props.filterCategory == -1 || this.props.filterCategory == this.state.category)) ? this.renderCollection() : null} 
        </div>
      )
  }
}

export default CollectionCard;