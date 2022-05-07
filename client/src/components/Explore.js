// Explore.js
import React from 'react';
import CollectionCard from './CollectionCard';

class Explore extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        collections: []
      };
    }

    componentDidMount = async () => {
      this.getAllCollections();
    };

    getAllCollections = async () => {
      const allCollections = await this.props.parentState.contractNFTManager.methods.getCollectionArray().call({ from: this.props.parentState.currentAccount });
      this.setState({collections: allCollections});
    }

    render() {
        return (
        <div>
          <div className="flex flex-col text-center w-full">
          <div className="flex mx-auto border-2 border-red-500 rounded overflow-hidden mt-6">
        <button className="py-1 px-4 bg-red-500 text-white focus:outline-none">Nouveautés</button>
        <button className="py-1 px-4 text-gray-500 focus:outline-none border-l-2 border-red-500">Art</button>
        <button className="py-1 px-4 text-gray-500 focus:outline-none border-l-2 border-red-500">Collectibles</button>
        <button className="py-1 px-4 text-gray-500 focus:outline-none border-l-2 border-red-500">Musique</button>
        <button className="py-1 px-4 text-gray-500 focus:outline-none border-l-2 border-red-500">Photographie</button>
        <button className="py-1 px-4 text-gray-500 focus:outline-none border-l-2 border-red-500">Sports</button>
      </div>
      </div>
      <section className="text-gray-600 body-font">
      <div className="container px-5 py-5 mx-auto">
        <div className="flex flex-wrap -m-4">
        {this.state.collections.map(collection => (
          <CollectionCard parentState={this.props.parentState} collectionAddress={collection} key={collection}/>
        ))}
        </div>
      </div>
</section>
        </div>
        )
    }
}

export default Explore;