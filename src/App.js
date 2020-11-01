import './App.css';
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Pdfano from './pdfano'
import regis from './regis'
class App extends React.Component {

  render() {
    return (
      <div className="App container">
        <Route path="/student" component={Pdfano} />
        <Route path="/register" component={regis} />
      </div>
    )
  }
}

export default App

