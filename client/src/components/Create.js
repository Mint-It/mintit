// Create.js
import React from 'react';

class Create extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
        return (
        <div>
          <div className="flex flex-col text-center w-full">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">Créer</h1>
          </div>
        </div>
        )
    }
}

export default Create;