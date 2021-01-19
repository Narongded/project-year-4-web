import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Pdfano from './pdfano'
import Login from './login'
import Chapter from './chapter'
import Managepdf from './managepdf'
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checkAuthen: ''
    }
  }

  componentDidMount() {
  }
  render() {
    return (
      <div className="App container" >
        <Route path="/">
          <Redirect to="/login" />
        </Route>
        <Route path="/login" component={Login} />
        <Route path="/student/:pdfid" component={Pdfano} />
        <Route path="/chapter/:userid" component={Chapter} />
        <Route path="/managepdf/:chapterid" component={Managepdf} />
      </div>
    )
  }
}

export default App

