import { BrowserRouter as Router, Routes, Route, NavLink, useParams } from 'react-router-dom';
import React from 'react';
import Web3 from "web3";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faUser, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons'
import logoMintit from './assets/img/mintit_logo.png';
import { ToastContainer, toast } from 'react-toastify';
import MintitNFTCollectionManagerContract from "./contracts/MintitNFTCollectionManager.json";
import "./App.css";
import 'react-toastify/dist/ReactToastify.min.css';
import Home from './components/Home';
import Create from './components/Create';
import Explore from './components/Explore';
import Artist from './components/Artist';
import Collection from './components/Collection';
import CollectionManager from './components/CollectionManager';
import NFT from './components/NFT';
import User from './components/User';
import Error from './components/Error';

library.add(faWallet, faUser, faHandHoldingDollar);

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      currentAccount: null,
      contractNFTManager: null,
      ethBalance: 0
    };
  }

  componentDidMount = async () => {
    this.connectWalletHandler();
  };

  connectWalletHandler = async () => {
    try {
      const web3 = new Web3(Web3.givenProvider);
      this.setState({ web3: web3});
      const accounts = await web3.eth.requestAccounts();
      if (accounts.length !== 0) {
        const networkId = await web3.eth.net.getId();
        const ethBalance = await web3.eth.getBalance(accounts[0]);
        const contract = new web3.eth.Contract(MintitNFTCollectionManagerContract.abi, MintitNFTCollectionManagerContract.networks[networkId].address);
        this.setState({currentAccount: accounts[0], contractNFTManager: contract, ethBalance: Web3.utils.fromWei(ethBalance)});
      } else {
        toast.error("No authorized account found.");
      }
      
    } catch (error) {
      // Catch any errors for any of the above operations.
      toast.error("Failed to load web3, accounts, or contract. Check console for details.");
      console.error(error);
    }
  }

  connectedWallet = () => {
    return (
      <NavLink to={'/user'}>
      <div className='flex flex-wrap items-center text-base'>
        <button disabled className='text-gray-600 py-2 px-2 mr-2 rounded border border-red-500 font-bold'>{parseFloat(this.state.ethBalance).toFixed(4)} ETH</button>
        <p id="userWallet" className="text-lg text-gray-600 leading-3"><span id="userWalletSpan" className="text-red-500 font-bold text-base">{this.state.currentAccount.slice(0,5)+'...'+this.state.currentAccount.slice(38,42)}</span><br /><span style={{fontSize: "10px"}}>WALLET CONNECTED</span></p>
      </div>
      </NavLink>
    )
  }
  
  connectWalletButton = () => {
    return (
      <button onClick={() => this.connectWalletHandler()} id="loginButton" className='inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0'>
      <FontAwesomeIcon icon="wallet" /> <span id="loginButtonText">	&nbsp;Connect Wallet</span> 
    </button>
    )
  }

  errorPage = () => {
    return (
      <Error />
    )
  }

  routesPage = () => {
    const CollectionWrapper = (props) => {
      const params = useParams();
      return <Collection parentState={this.state} {...{...props, match: {params}} } />
    }
    const NFTWrapper = (props) => {
      const params = useParams();
      return <NFT parentState={this.state} {...{...props, match: {params}} } />
    }
    const CollectionManagerWrapper = (props) => {
      const params = useParams();
      return <CollectionManager parentState={this.state} {...{...props, match: {params}} } />
    }
    return (
      <Routes>
        <Route exact path='/' element={<Home parentState={this.state}/>} />
        <Route exact path='/create' element={<Create parentState={this.state}/>} />
        <Route exact path='/explore' element={<Explore parentState={this.state}/>} />
        <Route exact path='/explore/:colAddress' element={<CollectionWrapper />} />
        <Route exact path='/explore/:colAddress/:tokenid' element={<NFTWrapper />} />
        <Route exact path='/artist' element={<Artist parentState={this.state}/>} />
        <Route exact path='/artist/:colAddress' element={<CollectionManagerWrapper />} />
        <Route exact path='/user' element={<User parentState={this.state}/>} />
        <Route exact path='/collection' element={<Collection parentState={this.state}/>} />
      </Routes>
    )
  }

  render() {
    return (
      <Router>
      <div className="App">
      <ToastContainer position="top-center" />
                <header className="text-gray-600 body-font">
  <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
  <NavLink to={'/'}><img className="w-22 h-10" alt="logo" src={logoMintit} /></NavLink>

    <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 flex flex-wrap items-center text-base justify-center">
      <NavLink to={'/explore'} className={({ isActive }) => 
      isActive ? "mr-5 text-gray-900" : "mr-5 hover:text-gray-900" }>Explore</NavLink>
      <NavLink to={'/create'} className={({ isActive }) => 
      isActive ? "mr-5 text-gray-900" : "mr-5 hover:text-gray-900" }>Create</NavLink>
    </nav>
    <NavLink to={'/artist'} className={({ isActive }) => 
      isActive ? "mr-2 text-gray-900" : "mr-2 hover:text-gray-900" }>
        <FontAwesomeIcon icon="user" /><span id="loginButtonText">&nbsp;Artist profile</span>
        </NavLink>
        {this.state.currentAccount ? this.connectedWallet() : this.connectWalletButton()}
  </div>
</header>
 
{this.state.currentAccount ? this.routesPage() : this.errorPage()}

<footer className="text-gray-600 body-font">
  <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
    <p className="text-sm text-gray-500 sm:py-2 sm:mt-0 mt-4">© 2022 Mint It</p>
    <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
      <a className="text-gray-500 hover:text-blue-500" href="#">
        <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
        </svg>
      </a>
      <a className="ml-3 text-gray-500 hover:text-blue-400" href="#">
        <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
        </svg>
      </a>
      <a className="ml-3 text-gray-500 hover:text-red-500" href="#">
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
        </svg>
      </a>
      <a className="ml-3 text-gray-500 hover:text-blue-600" href="#">
        <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0" className="w-5 h-5" viewBox="0 0 24 24">
          <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
          <circle cx="4" cy="4" r="2" stroke="none"></circle>
        </svg>
      </a>
    </span>
  </div>
</footer>
      </div>
      </Router>
    );
  }
}

export default App;
