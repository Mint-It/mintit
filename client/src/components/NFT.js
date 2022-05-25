// Collection.js
import React from 'react';
import Web3 from "web3";
import MintitNFTCollection from "../contracts/MintitNFTCollection.json";
import NFTCard from './NFTCard';
import { toast } from 'react-toastify';

class NFT extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        collectionAddress: "",
        tokenId : 0,
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
      const { colAddress } = this.props.match.params;
      this.state.collectionAddress = colAddress;
      this.setState({collectionAddress : String(colAddress)});
      const tokenid = this.props.match.params.tokenid;
      this.state.tokenId = tokenid;
      this.setState({tokenId : parseInt(tokenid)});
      const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.state.collectionAddress);
      this.setState({tokenURI : await contractNFT.methods.tokenURI(this.state.tokenId).call({ from: this.props.parentState.currentAccount })});
      this.setState({tokenImage : await this.getPictureFromMetadata()});
      this.setState({tokenOwner : await contractNFT.methods.ownerOf(this.state.tokenId).call({ from: this.props.parentState.currentAccount })});
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
        <section class="text-gray-600 body-font">
          <div class="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
            <img class="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded" alt="hero" src={this.state.tokenImage}/>
            <div class="text-center lg:w-2/3 w-full">
              <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">{this.state.tokenOwner.slice(0,5)+'...'+this.state.tokenOwner.slice(38,42)}</h1>
              <p class="mb-8 leading-relaxed">Meggings kinfolk echo park stumptown DIY, kale chips beard jianbing tousled. Chambray dreamcatcher trust fund, kitsch vice godard disrupt ramps hexagon mustache umami snackwave tilde chillwave ugh. Pour-over meditation PBR&amp;B pickled ennui celiac mlkshk freegan photo booth af fingerstache pitchfork.</p>
            </div>
          </div>
        </section>
        )
    }
}

export default NFT;