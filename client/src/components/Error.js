// Error.js
import React from 'react';

class Error extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
        return (
        <div>
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 mt-10 text-red-800">Please connect your wallet!</h1>
        </div>
        )
    }
}

export default Error;