// Collection.js
import React from 'react';
import MintitNFTCollection from "../contracts/MintitNFTCollection.json";
import NFTCard from './NFTCard';

class User extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        collections: [],
        Nfts : []
      };
    }

    componentDidMount = async () => {
        this.getAllCollections();
    };

    getAllCollections = async () => {
        var allCollections = await this.props.parentState.contractNFTManager.methods.getCollectionArray().call({ from: this.props.parentState.currentAccount });
        this.setState({collections: Array.from(allCollections).reverse()});
        console.log(this.state.collections);
        this.getUserCollection();
    }

    getUserCollection = async () => {
        let i, j;
        let Nfts = [];
        console.log("getUserCollection start : " + this.state.collections.length);
        for (i=0;i<this.state.collections.length;i++) {
            console.log("Collection : "+this.state.collections[i]);
            const contractNFT = new this.props.parentState.web3.eth.Contract(MintitNFTCollection.abi, this.state.collections[i]);
            const nbToken = await contractNFT.methods.balanceOf(this.props.parentState.currentAccount ).call({ from: this.props.parentState.currentAccount });
            console.log("NFTs : " + nbToken);

            for (j=0;j<nbToken;j++) {
              const token = await contractNFT.methods.tokenOfOwnerByIndex(this.props.parentState.currentAccount, j ).call({ from: this.props.parentState.currentAccount });
              const nft = [this.state.collections[i], token];
              Nfts.push(nft);
            }
        }
        this.setState({Nfts : Nfts});
    }

    renderNFTCollection () {
      /*if (this.state.isSelectedStage[4]) {
        let items=[];
        let i;
        for (i=0;i<this.state.totalSupply;i++)
          items.push("NFT " + i);*/

        return (
          <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
              <div className="flex flex-col text-center w-full mb-20">
                <h1 className="text-2xl font-medium title-font mb-4 text-gray-900">My NFT</h1>
                <p className="lg:w-2/3 mx-auto leading-relaxed text-base"></p>
              </div>
              <div className="flex flex-wrap -m-4">
                {this.state.Nfts.map((item, index) => (
                  <NFTCard parentState={this.props.parentState} collectionAddress={item[0]} key={item[1]} tokenId={item[1]}/>
                ))}
              </div>
            </div>
          </section>

        )
    }

    render() {
      return (
          <div>
            <section className="text-gray-600 body-font">
            </section>
            {this.renderNFTCollection()}
          </div>
        )
    }
}

export default User;