import React from 'react';
import Web3 from "web3";
import MintitNFTCollection from "../contracts/MintitNFTCollection.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom';

class NFTCard extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          tokenURI : "",
          tokenImage: "",
          tokenBaseExt: "",
          tokenOwner : ""
      };
    }

    componentDidMount = async () => {
      this.getCollection();
    };

    getCollection = async () => {
      const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.props.collectionAddress);
      this.setState({tokenURI : await contractNFT.methods.tokenURI(this.props.tokenId).call({ from: this.props.parentState.currentAccount })});
      this.setState({tokenImage : await this.getPictureFromMetadata()});
      this.setState({tokenOwner : await contractNFT.methods.ownerOf(this.props.tokenId).call({ from: this.props.parentState.currentAccount })});
      console.log("Image : " + this.state.tokenImage);
    }

    getPictureFromMetadata = async () => {
      try {
        let response = await fetch(this.state.tokenURI);
        let responseJson = await response.json();
        console.log(responseJson);
        if (responseJson.hasOwnProperty("external_url"))
          return responseJson.external_url
        if (responseJson.hasOwnProperty("image_url"))
          return responseJson.image_url;
        return responseJson.image;
      } catch(error) {
        console.error(error);
      }
    }

    render() {
      return (
      <div class="p-4 lg:w-1/4 md:w-1/2">
        <div class="h-full flex flex-col items-center text-center">
          <NavLink to={'/explore/' + this.props.collectionAddress + "/" + this.props.tokenId} className="text-red-500 inline-flex items-center md:mb-2 lg:mb-0">
          <img alt="team" class="flex-shrink-0 rounded-lg w-full h-56 object-cover object-center mb-4" src={this.state.tokenImage} />
          </NavLink>
          <div class="w-full">
            <h2 class="title-font font-medium text-lg text-gray-900">{this.state.tokenOwner.slice(0,5)+'...'+this.state.tokenOwner.slice(38,42)}</h2>
            <h3 class="text-gray-500 mb-3">Collection : <NavLink to={'/explore/' + this.props.collectionAddress} className="text-red-500 inline-flex items-center md:mb-2 lg:mb-0">{this.props.collectionAddress.slice(0,5)+'...'+this.props.collectionAddress.slice(38,42)} </NavLink></h3>
            <p class="mb-4">Token : {this.props.tokenId}</p>
          </div>
        </div>
      </div>
      )
    }
}

export default NFTCard;