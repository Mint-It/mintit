// Artist.js
import React from 'react';
import artist from '../assets/img/artist.jpg';
import Web3 from "web3";
import { toast } from 'react-toastify';
import CollectionCard from './CollectionCard';

class Artist extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        artistName: "",
        artistDescription: "",
        artistCollections: [],
        filterStage: -1,
        filterCategory: -1,
      }
    }

    componentDidMount = async () => {
      this.getArtist();
      this.props.parentState.contractNFTManager.events.ArtistUpdated([])
      .on('data', function(event){
        console.log(event.returnValues);
        if(event.returnValues["_created"]) toast.success("Artist created");
        else toast.success("Artist updated");
      })
    };

    handleChange = (evt) => {
      const value = evt.target.value;
      this.setState({
        ...this.state,
        [evt.target.name]: value
      });
    }

    setArtist = async () => {
        try{
          const artist = await this.props.parentState.contractNFTManager.methods.setArtist(this.state.artistName, this.state.artistDescription).send({ from: this.props.parentState.currentAccount });
          toast.info("Transaction sent");
        } catch (error) {
            // Catch any errors for any of the above operations.
            toast.error(error.message);
            console.error(error);
          }
    }

    getArtist = async () => {
      try{
        const artistDatas = await this.props.parentState.contractNFTManager.methods.getArtistDetails(this.props.parentState.currentAccount).call({ from:  this.props.parentState.currentAccount });
        this.setState({artistName: artistDatas['name'], artistDescription: artistDatas['description'], artistCollections: artistDatas['collections']});
      } catch (error) {
          // Catch any errors for any of the above operations.
          toast.error(error.message);
          console.error(error);
        }
  }

    render() {
        return (
        <div>
          <div className="flex flex-col text-center w-full">
          <section className="text-gray-600 body-font relative">
  <div className="absolute inset-0 bg-gray-300">
  <img className="w-full h-full object-cover" alt="artist" src={artist} />
  </div>
  <div className="container px-5 py-5 mx-auto flex">
  <div className="mr-6 lg:w-2/3 md:w-2/3 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
  <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">My Collections</h2>
  <div className="flex flex-wrap -m-4">
  {this.state.artistCollections.map(collection => (
            <CollectionCard parentState={this.props.parentState} collectionAddress={collection} key={collection} manageLink={true} filterStage={this.state.filterStage} filterCategory={this.state.filterCategory} />
 ))}
     
</div>
  </div>
    <div className="lg:w-1/3 md:w-1/3 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
      <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Artist</h2>
      <p className="leading-relaxed mb-5 text-gray-600">Set my artist profile</p>
      <div className="relative mb-4">
        <label htmlFor="artistName" className="leading-7 text-sm text-gray-600">Name</label>
        <input type="artistName" id="artistName" value={this.state.artistName} onChange={this.handleChange} name="artistName" className="w-full bg-white rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
      </div>
      <div className="relative mb-4">
        <label htmlFor="artistDescription" className="leading-7 text-sm text-gray-600">Description</label>
        <textarea id="artistDescription" name="artistDescription" value={this.state.artistDescription} onChange={this.handleChange} className="w-full bg-white rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
      </div>
      <button onClick={() => this.setArtist()} className="text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg">OK!</button>
    </div>
  </div>
</section>
          </div>
        </div>
        )
    }
}

export default Artist;