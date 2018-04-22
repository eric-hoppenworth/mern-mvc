module.exports =
`import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Splash from "./components/Splash";
import Home from "./components/Home";

class App extends Component {
  state = {
    secretWord: ""
  };

  handleChange = (event) => {
    const {name, value} = event.target;
        // Set the state for the appropriate input field
    this.setState({
      [name]: value
    });
  }

  render() {

    return (
      <Router>
        <div>
        <Route exact path = "/" render = {()=> {
            return <Splash
              handleChange= {this.handleChange}
              secretWord = {this.state.secretWord}
            />
        }}/>

        <Route exact path = "/home" render = {()=> {
            return <Home
                secret = {this.state.secretWord}
            />
        }}/>
        </div>
      </Router>
    );
  }
};

export default App;`;
