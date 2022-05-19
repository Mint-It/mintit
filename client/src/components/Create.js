// Create.js
import React from 'react';
import Web3 from "web3";
import { toast } from 'react-toastify';

class Create extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {
        name: "",
        symbol: "",
        maxSupply: "",
        presalePrice: "",
        mintPrice: "",
        maxPerWallet: "",
        banner: "",
        newBaseURI: "",
        extension: ".jpg",
        description: "",
        category: "Arts"
      };
    }

    componentDidMount = async () => {
      this.props.parentState.contractNFTManager.events.MintitNFTCollectionCreated([])
      .on('data', function(event){
        console.log(event.returnValues);
        toast.success("Collection created");
      })
    };

    handleChange = (evt) => {
      const value = evt.target.value;
      this.setState({
        ...this.state,
        [evt.target.name]: value
      });
    }

    createNFTCollection = async () => {
      const addressNFTContract = await this.props.parentState.contractNFTManager.methods.createMintitNFTCollection(this.state.name, this.state.symbol, [this.state.maxSupply, Web3.utils.toBN(Web3.utils.toWei(this.state.presalePrice)), Web3.utils.toBN(Web3.utils.toWei(this.state.mintPrice)), this.state.maxPerWallet], [this.state.banner, this.state.description, this.state.category, this.state.newBaseURI, this.state.extension]).send({ from: this.props.parentState.currentAccount });
      toast.info("Transaction sent");
    }

    render() {
        return (
        <div>
          <section className="text-gray-600 body-font relative">
  <div className="container px-5 py-5 mx-auto">
    <div className="flex flex-col text-center w-full mb-2">
      <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Create my NFT collection</h1>
    </div>
    <div className="lg:w-2/3 md:w-2/3 mx-auto">
      <div className="flex flex-wrap -m-2">
        <div className="p-2 w-1/3">
          <div className="relative">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
            <input required placeholder="Collection name" type="text" id="name" name="name" maxLength="40" value={this.state.name} onChange={this.handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="p-2 w-1/3">
          <div className="relative">
            <label htmlFor="symbol" className="leading-7 text-sm text-gray-600">Symbol</label>
            <input required type="text" placeholder="Collection symbol" id="symbol" name="symbol" maxLength="6" value={this.state.symbol} onChange={this.handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="p-2 w-1/3">
          <div className="relative">
            <label htmlFor="maxSupply" className="leading-7 text-sm text-gray-600">Max supply</label>
            <input required placeholder="10000" type="number" min="1" step="1" id="maxSupply" name="maxSupply" value={this.state.maxSupply} onChange={this.handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="p-2 w-1/3">
          <div className="relative">
            <label htmlFor="presalePrice" className="leading-7 text-sm text-gray-600">Presale price (ETH)</label>
            <input type="number" placeholder="1.2" min="0" step="0.1" id="presalePrice" name="presalePrice" value={this.state.presalePrice} onChange={this.handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="p-2 w-1/3">
          <div className="relative">
            <label htmlFor="mintPrice" className="leading-7 text-sm text-gray-600">Mint price (ETH)</label>
            <input type="number" placeholder="3.4" min="0" step="0.1" id="mintPrice" name="mintPrice" value={this.state.mintPrice} onChange={this.handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="p-2 w-1/3">
          <div className="relative">
            <label htmlFor="maxPerWallet" className="leading-7 text-sm text-gray-600">Max NFT per wallet</label>
            <input type="number" placeholder="1" min="1" step="1" id="maxPerWallet" name="maxPerWallet" value={this.state.maxPerWallet} onChange={this.handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="p-2 w-1/2">
          <div className="relative">
            <label htmlFor="banner" className="leading-7 text-sm text-gray-600">Banner image URL</label>
            <input type="url" placeholder="https://exemple.com/image.jpg" id="banner" name="banner" value={this.state.banner} onChange={this.handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="p-2 w-1/2">
          <div className="relative">
          <span className="mr-3">Category</span>
            <div className="relative">
              <select name="category" value={this.state.category} onChange={this.handleChange} className="w-full rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 text-base pl-3 pr-10">
                <option value="Arts">Arts</option>
                <option value="Collectibles">Collectibles</option>
                <option value="Music">Music</option>
                <option value="Photographie">Photographie</option>
                <option value="Sports">Sports</option>
              </select>
              <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </div>
          </div>
        </div>
        <div className="p-2 w-1/2">
          <div className="relative">
            <label htmlFor="newBaseURI" className="leading-7 text-sm text-gray-600">Base URI</label>
            <input type="text" placeholder="ipfs://exemple123" id="newBaseURI" name="newBaseURI" value={this.state.newBaseURI} onChange={this.handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="p-2 w-1/2">
          <div className="relative">
            <span className="mr-3">Extension</span>
            <div className="relative">
              <select name="extension" value={this.state.extension} onChange={this.handleChange} className="w-full rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 text-base pl-3 pr-10">
                <option value=".jpg">.jpg</option>
                <option value=".jpeg">.jpeg</option>
                <option value=".png">.png</option>
                <option value=".gif">.gif</option>
              </select>
              <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </div>
          </div>
        </div>
        <div className="p-2 w-full">
          <div className="relative">
            <label htmlFor="description" className="leading-7 text-sm text-gray-600">Description</label>
            <textarea id="description" name="description" value={this.state.description} onChange={this.handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
          </div>
        </div>
        <div className="p-2 w-full">
          <button onClick={() => this.createNFTCollection()}  className="flex mx-auto text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg">Create my collection</button>
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