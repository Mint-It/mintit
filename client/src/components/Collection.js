// Collection.js
import React from 'react';
import Web3 from "web3";
import MintitNFTCollection from "../contracts/MintitNFTCollection.json";
import NFTCard from './NFTCard';
import { toast } from 'react-toastify';

class Collection extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        collectionInfos: {'name' : "", "description" : "", "maxSupply" : 0, "price": 0, "presalePrice" : 0, category : ""},
        collectionAddress: "",
        artistAddress: "",
        calendar : [],
        isSelectedStage: [false, false, false, false, false],        
        iamWhitelisted: false,
        artistName: "",
        artistDescription: "",
        txHashes : []
      };
    }

    isDuplicate(txHash) {
      if (this.state.txHashes.includes(txHash)) return true;
      let txHashes = this.state.txHashes;
      txHashes.push(txHash);
      this.setState({txHashes : txHashes});
      return false;
    }

    componentDidMount = async () => {
      this.getCollection();
      console.log("Address:" + this.state.collectionAddress);
      const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.state.collectionAddress);

      contractNFT.events.Transfer([]).on('data', (event) => {
        console.log(event);
        if(!this.isDuplicate(event.transactionHash)){
          if (event.returnValues.to === this.props.parentState.currentAccount) {
            toast.success("Mint Successful");
            this.getCollection();
          }
        }
      });
      contractNFT.events.Whitelisted([]).on('data', (event) => {
        console.log(event);
        if(!this.isDuplicate(event.transactionHash)){
          if (event.returnValues._userAddress === this.props.parentState.currentAccount) {
            toast.success("You are whitelisted");
            this.getCollection();
          }
        }
      });      
    };

    getCollection = async () => {
      const { colAddress } = this.props.match.params;
      this.state.collectionAddress = colAddress;
      this.setState({collectionAddress : String(colAddress)});
      const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.state.collectionAddress);
      const infosNft = await contractNFT.methods.getCollectionInfos().call({ from: this.props.parentState.currentAccount });
      this.setState({collectionInfos : infosNft});
      this.setState({calendar : await contractNFT.methods.getCalendar().call()});
      this.setState({totalSupply : await contractNFT.methods.totalSupply().call()});
      this.setState({artistAddress : await contractNFT.methods.getArtistAddress().call()});
      const artistDatas = await this.props.parentState.contractNFTManager.methods.getArtistDetails(this.state.artistAddress).call({ from:  this.props.parentState.currentAccount });
      this.setState({artistName: artistDatas['name'], artistDescription: artistDatas['description']});

      let i;
      let now = parseInt(Date.now()/1000);
      let isSelectedStage = [false, false, false, false, false];
      for (i=0;i<this.state.calendar.length;i+=3) {
        if (this.state.calendar[i+1] < now && this.state.calendar[i+2] > now)
          isSelectedStage[this.state.calendar[i]] = true;    
      }
      if (this.state.totalSupply === this.state.collectionInfos.maxSupply) {
        for (i=0;i<isSelectedStage.length;i++) {
          isSelectedStage[i] = false;
        }
        isSelectedStage[4] = true;
      }
      this.setState({isSelectedStage : isSelectedStage});
      console.log("state :" + this.state.isSelectedStage);

      if (this.state.isSelectedStage[1])
        this.setState({iamWhitelisted : await contractNFT.methods.isPublicWhiteListed(this.props.parentState.currentAccount).call({ from: this.props.parentState.currentAccount })});
    }

    addWhitelist = async() => {
      const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.state.collectionAddress);
      try {
        await contractNFT.methods.addPublicWhitelist().send({ from: this.props.parentState.currentAccount });
        toast.info("Transaction sent");
      } catch (error) {
        // Catch any errors for any of the above operations.
        toast.error(error.message);
        console.error(error);
      }        
    }

    mint = async() => {
      const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.state.collectionAddress);
      if (this.state.isSelectedStage[2]) {
        try {
          await contractNFT.methods.PresaleMintArt([]).send({from: this.props.parentState.currentAccount, value: this.state.collectionInfos.presalePrice });
          toast.info("Mint transaction sent");
        } catch (error) {
          // Catch any errors for any of the above operations.
          toast.error(error.message);
          console.error(error);
        }
      }
      else if (this.state.isSelectedStage[3]) {
        try {
          await contractNFT.methods.MintArt().send({from: this.props.parentState.currentAccount, value: this.state.collectionInfos.price });
          toast.info("Mint transaction sent");
        } catch (error) {
          // Catch any errors for any of the above operations.
          toast.error(error.message);
          console.error(error);
        }
      }
    }

    renderSoon() {
      if (this.state.isSelectedStage[0]) {
        return (
          <section className="text-gray-600 body-font">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Collection coming soon
            </h1>
          </section>
        )
      }
      else 
        return(
          <section className="text-gray-600 body-font">
          </section>
        )
    }

    renderPublicWhitelist () {
      if (this.state.isSelectedStage[1] && !this.state.iamWhitelisted) {
        return (
          <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
              <div className="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto">
                <h1 className="flex-grow sm:pr-16 text-2xl font-medium title-font text-gray-900">Press Whitelist button if you want to have access to the Presale</h1>
                <button className="flex-shrink-0 text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg mt-10 sm:mt-0" onClick={() => this.addWhitelist()}>Add me to Whitelist</button>
              </div>
            </div>
          </section>
        )
      }
      else if (this.state.isSelectedStage[1] && this.state.iamWhitelisted) {
        return (
          <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
              <div className="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto">
                <h1 className="flex-grow sm:pr-16 text-2xl font-medium title-font text-gray-900">You are already Whitelisted</h1>
                <button className="flex-shrink-0 text-gray-700 bg-gray-100 border-0 py-2 px-8 focus:outline-none rounded text-lg mt-10 sm:mt-0">Add me to Whitelist</button>
              </div>
            </div>
          </section> 
        )       
      }
      else 
        return(
          <section className="text-gray-600 body-font">
          </section>
        )
    }

    formatDate(dateTS) {
      var date = new Date(dateTS );
      return date.toLocaleString();
    }

    renderCalendarItem(i) {
      if (i%3 === 0) {
        let stageValue = this.state.calendar[i];
        let stage = "";
        switch (stageValue) {
          case "0":
            stage = "Configuration";
            break;
          case "1":
            stage = "Public whitelist";
            break;
          case "2":
            stage = "Presale";
            break;
          case "3":
            stage = "Sale";
            break;
          default:
            stage = "";
        }
        let classVal = "px-4 py-3";
        let start = this.formatDate(this.state.calendar[i+1]*1000);
        let end = this.formatDate(this.state.calendar[i+2]*1000);
        if (this.state.calendar[i+1]*1000 < Date.now() && this.state.calendar[i+2]*1000 > Date.now())
        classVal = "text-red-500 px-4 py-3";
        return (
          <React.Fragment>
          <tr>
          <td className={classVal}>{stage}</td>
          <td className={classVal}>{start}</td>
          <td className={classVal}>{end}</td>
          </tr>
          </React.Fragment>
        )
      }
      else {
        return (
          <React.Fragment>
          </React.Fragment>
        )
      }

    }

    renderCalendar () {
      return (
        <div className="lg:w-2/3 w-full mx-auto overflow-auto">
        <table className="table-auto w-full text-left whitespace-no-wrap">
          <thead>
            <tr>
            <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">Stage</th>
            <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Start date</th>
            <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">End date</th>
            </tr>
          </thead>
          <tbody>
            {this.state.calendar.map((item, index) => (
                this.renderCalendarItem(index)
            ))}
          </tbody>
        </table>
      </div>
      )
    }

    renderSale () {
      if ((this.state.isSelectedStage[2] && this.state.iamWhitelisted) || this.state.isSelectedStage[3]) {
        let price = "";
        if (this.state.isSelectedStage[3])
          price = Web3.utils.fromWei(Web3.utils.toBN(this.state.collectionInfos.price));
        else
          price = Web3.utils.fromWei(Web3.utils.toBN(this.state.collectionInfos.presalePrice));

        return (
          <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
              <div className="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto">
                <h1 className="flex-grow sm:pr-16 text-2xl font-medium title-font text-gray-900">Mint a NFT</h1>
                <button className="flex-shrink-0 text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg mt-10 sm:mt-0" onClick={() => this.mint()}>Mint { price} ETH</button>
              </div>
            </div>
          </section>
        )
      }
      else if ((this.state.isSelectedStage[2] && !this.state.iamWhitelisted)) {
        return (
          <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
              <div className="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto">
                <h1 className="flex-grow sm:pr-16 text-2xl font-medium title-font text-gray-900">You are not whitelisted</h1>
              </div>
            </div>
          </section>
        )
      }
      else 
        return(
          <section className="text-gray-600 body-font">
          </section>
        )
    }

    renderNFTCollection () {
      if (this.state.isSelectedStage[4]) {
        let items=[];
        let i;
        for (i=0;i<this.state.totalSupply;i++) items.push("NFT " + i);
        return (
          <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
              <div className="flex flex-col text-center w-full mb-20">
                <h1 className="text-2xl font-medium title-font mb-4 text-gray-900">Minted NFT</h1>
                <p className="lg:w-2/3 mx-auto leading-relaxed text-base"></p>
              </div>
              <div className="flex flex-wrap -m-4">
                {items.map((item, index) => (
                  <NFTCard parentState={this.props.parentState} collectionAddress={this.state.collectionAddress} key={index+1} tokenId={index+1}/>
                ))}
              </div>
            </div>
          </section>

        )
      }
      else 
        return(
          <section className="text-gray-600 body-font">
          </section>
        )
    }

    render() {
      return (
          <div>
            <section className="text-gray-600 body-font">
              <div className="container mx-auto flex px-5 py-5 md:flex-row flex-col items-center">
                <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
                  <img className="lg:h-48 md:h-36 w-full object-cover object-center" alt="hero" src={this.state.collectionInfos.banner}  />
                </div>
                <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
                  <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">{this.state.collectionInfos.name}
                  <br />
                  by {this.state.artistName}
                    <br className="hidden lg:inline-block" />
                  </h1>
                  <p className="mb-8 leading-relaxed">{this.state.collectionInfos.description}</p>
                  <p className="mb-8 leading-relaxed">Supply {this.state.totalSupply} / {this.state.collectionInfos.maxSupply}
                  <br></br>
                  Presale Price : {Web3.utils.fromWei(Web3.utils.toBN(this.state.collectionInfos.presalePrice))} ETH
                  <br></br>
                  Sale Price : {Web3.utils.fromWei(Web3.utils.toBN(this.state.collectionInfos.price))} ETH
                  <br></br>
                  Max mint per wallet : {this.state.collectionInfos.maxPerWallet}
                  </p>
                  {this.renderCalendar()}
                  </div>
              </div>
            </section>
            {this.renderSoon()}
            {this.renderPublicWhitelist()}
            {this.renderSale()}
            {this.renderNFTCollection()}
          </div>
        )
    }
}

export default Collection;