// Home.js
import React from 'react';
import Web3 from "web3";
import MintitNFTCollection from "../contracts/MintitNFTCollection.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CollectionCard from './CollectionCard';

class Home extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        filterStage: -1,
        filterCategory: -1,
        collections: []
      };
    }

    componentDidMount = async () => {
      this.getAllCollections();
    };

    getAllCollections = async () => {
      var allCollections = await this.props.parentState.contractNFTManager.methods.getCollectionArray().call({ from: this.props.parentState.currentAccount });
      this.setState({collections: Array.from(allCollections).reverse()});
      console.log(allCollections)
    }

    render() {
        return (
        <div>
            <div className="flex flex-col text-center w-full">
      <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">New Collections</h1>
    </div>
    <section className="text-gray-600 body-font">
  <div className="container px-5 py-5 mx-auto">
    <div className="flex flex-wrap -m-4">
    {this.state.collections.map(collection => (
        <CollectionCard parentState={this.props.parentState} collectionAddress={collection} key={collection}  filterStage={this.state.filterStage} filterCategory={this.state.filterCategory}/>
    ))}
    </div>
  </div>
</section>
        </div>
        )
    }
}

export default Home;