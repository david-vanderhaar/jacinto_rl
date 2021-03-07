import React from 'react';
import './App.css';
import Nystrum from './nystrum/Nystrum';

class App extends React.Component {
  render() {
    return (
      <div className="App container-fluid">
        <Nystrum />
      </div>
    );
  }
}

export default App;
