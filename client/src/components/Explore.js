// Explore.js
import React from 'react';
import CollectionCard from './CollectionCard';

class Explore extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        collections: [],
        filterStage: -1,
        filterCategory: -1,
        stageArray: [
            {id:-1, name:"All"},
            {id:0, name:"Soon"},
            {id:1, name:"Whitelist"},
            {id:2, name:"Presale"},
            {id:3, name:"Sale"},
            {id:4, name:"Soldout"},
            {id:5, name:"Reveal"}
        ],
        categoryArray: [
          {id:-1, name:"All"},
          {id:0, name:"Art"},
          {id:1, name:"Collectibles"},
          {id:2, name:"Musique"},
          {id:3, name:"Photographie"},
          {id:4, name:"Sports"}
        ]
      };
    }

    componentDidMount = async () => {
      this.getAllCollections();
    };

    getAllCollections = async () => {
      var allCollections = await this.props.parentState.contractNFTManager.methods.getCollectionArray().call({ from: this.props.parentState.currentAccount });
      this.setState({collections: Array.from(allCollections).reverse()});
    }

    selectPhase(phase) {
      console.log("phase : " + phase);
      this.setState({filterStage: phase});
    }

    buttonStageStyle(buttonPhase) {
      console.log("button style " + buttonPhase);
      if (buttonPhase == this.state.filterStage)
        return "py-1 px-4 bg-red-500 text-white focus:outline-none";
      else
        return "py-1 px-4 text-gray-500 focus:outline-none border-l-2 border-red-500";
    }

    selectCategory(category) {
      this.setState({filterCategory: category});
    }

    buttonCatStyle(buttonCat) {
      if (buttonCat == this.state.filterCategory)
        return "py-1 px-4 bg-red-500 text-white focus:outline-none";
      else
        return "py-1 px-4 text-gray-500 focus:outline-none border-l-2 border-red-500";
    }

    render() {
        return (
        <div>
          <div className="flex flex-col text-center w-full">
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-500">Category.</p>
            <div className="flex mx-auto border-2 border-red-500 rounded overflow-hidden mt-2 mb-6">
              {this.state.categoryArray.map(category => (
              <button className={this.buttonCatStyle(category.id)} onClick={() => this.selectCategory(category.id)} >{category.name}</button>
              ))}
            </div>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-500">Mint Phase.</p>
            <div className="flex mx-auto border-2 border-red-500 rounded overflow-hidden mt-2">
              {this.state.stageArray.map(stage => (
              <button className={this.buttonStageStyle(stage.id)} onClick={() => this.selectPhase(stage.id)} >{stage.name}</button>
              ))}
            </div>
          </div>
          <section className="text-gray-600 body-font">
            <div className="container px-5 py-5 mx-auto">
              <div className="flex flex-wrap -m-4">
                {this.state.collections.map(collection => (
                <CollectionCard parentState={this.props.parentState} collectionAddress={collection} key={collection} filterStage={this.state.filterStage} filterCategory={this.state.filterCategory}/>
                ))}
              </div>
            </div>
          </section>
        </div>
        )
    }
}

export default Explore;