import React, { Component } from 'react';
import SimpleStorageContract from "./contracts/SimpleStorage.json";
//import getWeb3 from "./getWeb3";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet } from '@fortawesome/free-solid-svg-icons'

import "./App.css";

library.add(faWallet);

const supportedChainId = 97;

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, currentAccount: null };

  componentDidMount = async () => {
    this.checkWalletIsConnected();
  };

  connectWalletHandler = async () => {
    try {
      //console.log(this.state.accounts);
      // Get network provider and web3 instance.
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      this.setState({currentAccount: account});
      //const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      //const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      //const networkId = await web3.eth.net.getId();
      //const deployedNetwork = SimpleStorageContract.networks[networkId];

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      //this.setState({ web3, accounts });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  checkWalletIsConnected = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length !== 0) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const account = accounts[0];
        this.setState({currentAccount: account});
    } else {
      console.log("No authorized account found");
    }
  }

  connectedWallet = () => {
    return (
      <div className='flex flex-wrap items-center text-base'>
        <p id="userWallet" style={{lineHeight: "12px"}} className="text-lg text-gray-600"><span id="userWalletSpan" style={{color: "#66cf8e", fontSize: "16px", fontWeight: "bold"}}>{this.state.currentAccount.slice(0,5)+'...'+this.state.currentAccount.slice(38,42)}</span><br /><span style={{fontSize: "10px"}}>WALLET CONNECTED</span></p>
      </div>
    )
  }
  
  connectWalletButton = () => {
    return (
      <button onClick={() => this.connectWalletHandler()} id="loginButton" className='bg-gray-900 text-gray-200 py-2 px-3 mx-2 rounded border border-indigo-500 hover:bg-gray-800 hover:text-gray-100'>
      <FontAwesomeIcon icon="wallet" /> <span id="loginButtonText">Connect Wallet</span> 
    </button>
    )
  }

  render() {
    return (
      <div className="App">
                <header className="text-gray-400 bg-gray-900 body-font">
  <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
    <a className="flex title-font font-medium items-center text-white mb-4 md:mb-0">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
      <span className="ml-3 text-xl">My Duss</span>
    </a>
    <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-700	flex flex-wrap items-center text-base justify-center">
      <a className="mr-5 hover:text-white">First Link</a>
      <a className="mr-5 hover:text-white">Second Link</a>
      <a className="mr-5 hover:text-white">Third Link</a>
      <a className="mr-5 hover:text-white">Fourth Link</a>
    </nav>
    {this.state.currentAccount ? this.connectedWallet() : this.connectWalletButton()}
  </div>
</header>
        
<footer className="text-gray-400 bg-gray-900 body-font">
  <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
    <p className="text-sm text-gray-400 sm:py-2 sm:mt-0 mt-4">© 2022 My Duss</p>
    <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
      <a className="text-gray-400">
        <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
        </svg>
      </a>
      <a className="ml-3 text-gray-400">
        <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
        </svg>
      </a>
      <a className="ml-3 text-gray-400">
        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
        </svg>
      </a>
      <a className="ml-3 text-gray-400">
        <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0" className="w-5 h-5" viewBox="0 0 24 24">
          <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
          <circle cx="4" cy="4" r="2" stroke="none"></circle>
        </svg>
      </a>
    </span>
  </div>
</footer>
      </div>
    );
  }
}

export default App;
