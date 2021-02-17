import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Pdfano from './pdfano'
import Login from './login'
import Chapter from './chapter'
import Managepdf from './managepdf'
import Studentchapter from './studentChapter'
import StudentPdf from './studentPdf'
class Routes extends Component {
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
        <Route exact path="/">
          <Redirect to='/login'/>
        </Route>
        <Route path="/login" component={Login} />
        <Route path="/student/:pdfid" component={Pdfano} />
        <Route path="/chapter/:userid" component={Chapter} />
        <Route path="/managepdf/:chapterid" component={Managepdf} />
        <Route path= "/student-chapter/:userid" component = {Studentchapter}/>
        <Route path= "/student-pdf/:chapterid" component = {StudentPdf}/>
      </div>
    )
  }
}

export default Routes

