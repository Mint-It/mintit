// Create.js
import React from 'react';
import Web3 from "web3";
import MintitNFTCollectionManagerContract from "../contracts/MintitNFTCollectionManager.json";
import { MintitNFTCollectionManagerContractAddress } from "../contractAddresses";

class Create extends React.Component {
  state = {contract: null};

    constructor(props) {
      super(props);
    }

    componentDidMount = async () => {
      
    };

    createNFTCollection = async () => {
      const contract = new this.props.parentState.web3.eth.Contract(MintitNFTCollectionManagerContract.abi, MintitNFTCollectionManagerContractAddress);
      const test = await contract.methods.createMintitNFTCollection("test", "test").send({ from: this.props.parentState.currentAccount });
      console.log(test);
    }

    render() {
        return (
        <div>
          <section className="text-gray-600 body-font relative">
  <div className="container px-5 py-5 mx-auto">
    <div className="flex flex-col text-center w-full mb-12">
      <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Créer ma collection NFT</h1>
      <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify.</p>
    </div>
    <div className="lg:w-1/2 md:w-2/3 mx-auto">
      <div className="flex flex-wrap -m-2">
        <div className="p-2 w-1/2">
          <div className="relative">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">Nom</label>
            <input type="text" id="name" name="name" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="p-2 w-1/2">
          <div className="relative">
            <label htmlFor="symbol" className="leading-7 text-sm text-gray-600">Symbol</label>
            <input type="symbol" id="symbol" name="symbol" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="p-2 w-full">
          <div className="relative">
            <label htmlFor="description" className="leading-7 text-sm text-gray-600">Description</label>
            <textarea id="description" name="description" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
          </div>
        </div>
        <div className="p-2 w-full">
          <button onClick={() => this.createNFTCollection()}  className="flex mx-auto text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg">Créer</button>
        </div>
      </div>
    </div>
  </div>
</section>
        </div>
        )
    }
}

export default Create;