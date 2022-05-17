// CollectionManager.js
import React from 'react';
import Web3 from "web3";
import MintitNFTCollection from "../contracts/MintitNFTCollection.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NFTCard from './NFTCard';
import { toast } from 'react-toastify';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import DateTimePicker from 'react-datetime-picker';

class CollectionManager extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        collectionAddress: "",
        collectionInfos: {'name' : "", "description" : "", "maxSupply" : 0, "price": 0, "presalePrice" : 0, maxPerWallet: 0, category : ""},        maxSupply: "",
        maxSupply: "",
        presalePrice: "",
        mintPrice: "",
        maxPerWallet: "",
        banner: "",
        baseURI: "",
        baseExtension: "",
        description: "",
        category: "",
        startDateWhitelist: new Date(),
        endDateWhitelist: new Date()
      }
    }

    handleChange = (evt) => {
      const value = evt.target.value;
      this.setState({
        ...this.state,
        [evt.target.name]: value
      });
    }

    componentDidMount = async () => {
        this.getCollection();
        const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.state.collectionAddress);
    };

    setMaxSupply = async () => {
      const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.state.collectionAddress);
      const infosNft = await contractNFT.methods.setMaxSupply(this.state.maxSupply).send({ from: this.props.parentState.currentAccount });
    }

    setPresalePrice = async () => {
      const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.state.collectionAddress);
      const infosNft = await contractNFT.methods.setPresalePrice(Web3.utils.toBN(Web3.utils.toWei(this.state.presalePrice))).send({ from: this.props.parentState.currentAccount });
    }

    setPrice = async () => {
      const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.state.collectionAddress);
      const infosNft = await contractNFT.methods.setPrice(Web3.utils.toBN(Web3.utils.toWei(this.state.mintPrice))).send({ from: this.props.parentState.currentAccount });
    }

    setBaseExtension = async () => {
      const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.state.collectionAddress);
      const infosNft = await contractNFT.methods.setBaseExtension(this.state.baseExtension).send({ from: this.props.parentState.currentAccount });
    }

    setMaxNbPerWallet = async () => {
      const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.state.collectionAddress);
      const infosNft = await contractNFT.methods.setMaxNbPerWallet(this.state.maxPerWallet).send({ from: this.props.parentState.currentAccount });
    }

    setBanner = async () => {
      const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.state.collectionAddress);
      const infosNft = await contractNFT.methods.setBanner(this.state.banner).send({ from: this.props.parentState.currentAccount });
    }

    setDescription = async () => {
      console.log(this.state.description);
      const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.state.collectionAddress);
      const infosNft = await contractNFT.methods.setDescription(this.state.description).send({ from: this.props.parentState.currentAccount });
    }

    setBaseURI = async () => {
      const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.state.collectionAddress);
      const infosNft = await contractNFT.methods.setBaseURI(this.state.baseURI).send({ from: this.props.parentState.currentAccount });
    }

    setCalendar = async () => {
      const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.state.collectionAddress);
      const infosNft = await contractNFT.methods.setCalendar([1, 1652821948, 1652821988]).send({ from: this.props.parentState.currentAccount });
    }

    getCollection = async () => {
        const { colAddress } = this.props.match.params;
        this.state.collectionAddress = colAddress;
        this.setState({collectionAddress : String(colAddress)});
        const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.state.collectionAddress);
        const infosNft = await contractNFT.methods.getCollectionInfos().call({ from: this.props.parentState.currentAccount });
        this.setState({collectionInfos : infosNft});
        console.log(infosNft)

    }

    render() {
        return (
        <div>
          <Tabs>
            <section className="text-gray-600 body-font">
            
  <div className="container px-5 py-5 mx-auto flex flex-wrap flex-col">
    <TabList className="flex mx-auto flex-wrap">
      <Tab className="cursor-pointer sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none border-gray-200 hover:text-gray-900 tracking-wider">
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5 mr-3" viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>COLLECTION
      </Tab>
      <Tab className="cursor-pointer sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none border-gray-200 hover:text-gray-900 tracking-wider">
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5 mr-3" viewBox="0 0 24 24">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>STAGE
      </Tab>
    </TabList>
  </div>
</section>
<TabPanel>
  <div className="lg:w-2/3 md:w-2/3 mx-auto">
      <div className="flex flex-wrap -m-2">
        <div className="p-2 w-1/2">
          <div className="relative">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
            <input placeholder={this.state.collectionInfos.name} type="text" id="name" name="name" maxLength="40" readOnly className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="p-2 w-1/2">
          <div className="relative">
            <label htmlFor="symbol" className="leading-7 text-sm text-gray-600">Symbol</label>
            <input type="text" placeholder={this.state.collectionInfos.symbol} id="symbol" name="symbol" maxLength="6" readOnly className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="p-2 w-1/2">
          <div className="relative">
            <label htmlFor="maxSupply" className="leading-7 text-sm text-gray-600">Max supply</label>
            <input required placeholder={this.state.collectionInfos.maxSupply} type="number" min="1" step="1" id="maxSupply" name="maxSupply" value={this.state.maxSupply} onChange={this.handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="p-2 w-1/2">
          <button onClick={() => this.setMaxSupply()}  className="flex mx-auto text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg">Change max supply</button>
        </div>
        <div className="p-2 w-1/2">
          <div className="relative">
            <label htmlFor="presalePrice" className="leading-7 text-sm text-gray-600">Presale price (ETH)</label>
            <input type="number" placeholder={Web3.utils.fromWei(Web3.utils.toBN(this.state.collectionInfos.presalePrice))} min="0" step="0.1" id="presalePrice" name="presalePrice" value={this.state.presalePrice} onChange={this.handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="p-2 w-1/2">
          <button onClick={() => this.setPresalePrice()}  className="flex mx-auto text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg">Change presale price</button>
        </div>
        <div className="p-2 w-1/2">
          <div className="relative">
            <label htmlFor="mintPrice" className="leading-7 text-sm text-gray-600">Mint price (ETH)</label>
            <input type="number" placeholder={Web3.utils.fromWei(Web3.utils.toBN(this.state.collectionInfos.price))} min="0" step="0.1" id="mintPrice" name="mintPrice" value={this.state.mintPrice} onChange={this.handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="p-2 w-1/2">
          <button onClick={() => this.setPrice()}  className="flex mx-auto text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg">Change price</button>
        </div>
        <div className="p-2 w-1/2">
          <div className="relative">
            <label htmlFor="maxPerWallet" className="leading-7 text-sm text-gray-600">Max NFT per wallet</label>
            <input type="number" placeholder={this.state.collectionInfos.maxPerWallet} min="1" step="1" id="maxPerWallet" name="maxPerWallet" value={this.state.maxPerWallet} onChange={this.handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="p-2 w-1/2">
          <button onClick={() => this.setMaxNbPerWallet()}  className="flex mx-auto text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg">Change max NFT</button>
        </div>
        <div className="p-2 w-1/2">
          <div className="relative">
            <label htmlFor="banner" className="leading-7 text-sm text-gray-600">Banner image URL</label>
            <input type="url" placeholder={this.state.collectionInfos.banner} id="banner" name="banner" value={this.state.banner} onChange={this.handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="p-2 w-1/2">
          <button onClick={() => this.setBanner()}  className="flex mx-auto text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg">Change banner</button>
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
          <button onClick={() => this.setCategory()}  className="flex mx-auto text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg">Change category</button>
        </div>
        <div className="p-2 w-1/2">
          <div className="relative">
            <label htmlFor="baseURI" className="leading-7 text-sm text-gray-600">Base URI</label>
            <input type="text" placeholder={this.state.collectionInfos.baseURI} id="baseURI" name="baseURI" value={this.state.baseURI} onChange={this.handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="p-2 w-1/2">
          <button onClick={() => this.setBaseURI()}  className="flex mx-auto text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg">Change base URI</button>
        </div>
        <div className="p-2 w-1/2">
          <div className="relative">
            <span className="mr-3">Extension</span>
            <div className="relative">
              <select name="extension" value={this.state.extension} onChange={this.handleChange} className="w-full rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 text-base pl-3 pr-10">
                <option value=".jpg">jpg</option>
                <option value=".jpeg">jpeg</option>
                <option value=".png">png</option>
                <option value=".gif">gif</option>
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
          <button onClick={() => this.setBaseExtension()}  className="flex mx-auto text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg">Change extension</button>
        </div>
        <div className="p-2 w-1/2">
          <div className="relative">
            <label htmlFor="description" className="leading-7 text-sm text-gray-600">Description</label>
            <textarea id="description"  placeholder={this.state.collectionInfos.description} name="description" value={this.state.description} onChange={this.handleChange} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
          </div>
        </div>
        <div className="p-2 w-1/2">
          <button onClick={() => this.setDescription()}  className="flex mx-auto text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg">Change description</button>
        </div>
      </div>
    </div>
</TabPanel>
<TabPanel>
<section className="text-gray-600 body-font">
  <div className="container px-5 pb-5 mx-auto flex flex-wrap">
    <div className="flex flex-wrap w-full">
      <div className="w-1/2 mt-5 mx-auto">
        <div className="flex relative pb-12">
          <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
            <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
          </div>
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500 inline-flex items-center justify-center text-white relative z-10">
            1
          </div>
          <div className="flex-grow pl-4">
            <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Public Whitelist</h2>
            <div className="flex flex-wrap -m-2"><div className="w-1/2 p-2"> 
            <div className="relative">
            <label htmlFor="startDateWhitelist" className="leading-7 text-sm text-gray-600">Starting date/time</label>
            <DateTimePicker onChange={this.handleChange} value={this.state.startDateWhitelist} />
            </div>
            </div>
            <div className="w-1/2 p-2"> 
            <div className="relative">
            <label htmlFor="endDateWhitelist" className="leading-7 text-sm text-gray-600">Ending date/time</label>
            <DateTimePicker onChange={this.handleChange} value={this.state.endDateWhitelist} />
            </div></div>
            </div>
          </div>
        </div>
        <div className="flex relative pb-12">
          <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
            <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
          </div>
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500 inline-flex items-center justify-center text-white relative z-10">
            2
          </div>
          <div className="flex-grow pl-4">
            <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Presale</h2>
        </div>
        </div>
        <div className="flex relative pb-12">
          <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
            <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
          </div>
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500 inline-flex items-center justify-center text-white relative z-10">
            3
          </div>
          <div className="flex-grow pl-4">
            <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Sale</h2>
            </div>
        </div>
        <div className="flex relative">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500 inline-flex items-center justify-center text-white relative z-10">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <path d="M22 4L12 14.01l-3-3"></path>
            </svg>
          </div>
          <div className="flex-grow pl-4">
          <button onClick={() => this.setCalendar()}  className="flex mx-auto text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg">Set the calendar</button>

            </div>
        </div>
      </div>
    </div>
  </div>
</section>
</TabPanel>
</Tabs>
        </div>
        )
    }
}

export default CollectionManager;