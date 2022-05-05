// Artist.js
import React from 'react';
//import artistsContract from "../contracts/Artists.json";
import artist from '../assets/img/artist.jpg';

class Artist extends React.Component {
    constructor(props) {
      super(props);
    }

    setArtist = async () => {
        try{
            //await contract.methods.setArtist().send({ from: accounts[0] });
           
          } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
              error,
            );
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
    <div className="lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
      <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Artiste</h2>
      <p className="leading-relaxed mb-5 text-gray-600">Crée ton profil Artiste</p>
      <div className="relative mb-4">
        <label htmlFor="artistName" className="leading-7 text-sm text-gray-600">Nom</label>
        <input type="artistName" id="artistName" name="artistName" className="w-full bg-white rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
      </div>
      <div className="relative mb-4">
        <label htmlFor="artistDescription" className="leading-7 text-sm text-gray-600">Description</label>
        <textarea id="artistDescription" name="artistDescription" className="w-full bg-white rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
      </div>
      <button className="text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg">OK!</button>
      <p className="text-xs text-gray-500 mt-3">Chicharrones blog helvetica normcore iceland tousled brook viral artisan.</p>
    </div>
  </div>
</section>
          </div>
        </div>
        )
    }
}

export default Artist;