import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import React from 'react';
import Web3 from "web3";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faUser } from '@fortawesome/free-solid-svg-icons'
import logoMintit from './assets/img/mintit_logo.png';

import "./App.css";
import Home from './components/Home';
import Create from './components/Create';
import Explore from './components/Explore';
import Artist from './components/Artist';
import Error from './components/Error';

library.add(faWallet, faUser);

class App extends React.Component {
  state = {web3: null, currentAccount: null, contract: null};

  componentDidMount = async () => {
    this.connectWalletHandler();
  };

  connectWalletHandler = async () => {
    try {
      const web3 = new Web3(Web3.givenProvider);
      this.setState({ web3: web3});
      const accounts = await web3.eth.requestAccounts();
      if (accounts.length !== 0) {
        this.setState({currentAccount: accounts[0]});
      } else {
        console.log("No authorized account found");
      }
      // Get the contract instance.
      //const networkId = await web3.eth.net.getId();
      //const deployedNetwork = SimpleStorageContract.networks[networkId];
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  connectedWallet = () => {
    return (
      <div className='flex flex-wrap items-center text-base'>
        <p id="userWallet" className="text-lg text-gray-600 leading-3"><span id="userWalletSpan" className="text-red-500 font-bold text-base">{this.state.currentAccount.slice(0,5)+'...'+this.state.currentAccount.slice(38,42)}</span><br /><span style={{fontSize: "10px"}}>WALLET CONNECTED</span></p>
      </div>
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
    return (
      <Routes>
        <Route exact path='/' element={<Home parentState={this.state}/>} />
        <Route exact path='/create' element={<Create parentState={this.state}/>} />
        <Route exact path='/explore' element={<Explore parentState={this.state}/>} />
        <Route exact path='/artist' element={<Artist parentState={this.state}/>} />
      </Routes>
    )
  }

  render() {
    return (
      <Router>
      <div className="App">
                <header className="text-gray-600 body-font">
  <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
  <a href='/'><img className="w-22 h-10" alt="logo" src={logoMintit} /></a>

    <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 flex flex-wrap items-center text-base justify-center">
      <NavLink to={'/explore'} className={({ isActive }) => 
      isActive ? "mr-5 text-gray-900" : "mr-5 hover:text-gray-900" }>Explore</NavLink>
      <NavLink to={'/create'} className={({ isActive }) => 
      isActive ? "mr-5 text-gray-900" : "mr-5 hover:text-gray-900" }>Create</NavLink>
    </nav>
    <NavLink to={'/artist'} className={({ isActive }) => 
      isActive ? "mr-5 text-gray-900" : "mr-5 hover:text-gray-900" }>
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
      <a className="text-gray-500">
        <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
        </svg>
      </a>
      <a className="ml-3 text-gray-500">
        <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
        </svg>
      </a>
      <a className="ml-3 text-gray-500">
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
        </svg>
      </a>
      <a className="ml-3 text-gray-500">
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
