import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Pdfano from './pdfano'
import Login from './login'
import Chapter from './teacherChapter'
import Managepdf from './teacherManagepdf'
import Studentchapter from './studentChapter'
import StudentPdf from './studentFilepdf'
import Studentlecture from './studentLecture'
import Question from './question'
import Teacherlecturestudent from './teacherLecturestudent'
import Search from './search'
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
          <Redirect to='/login' />
        </Route>
        <Route path="/login" component={Login} />
        <Route path="/search/:userid" component={Search} />
        <Route path="/student/:pdfid" component={Pdfano} />
        <Route path="/chapter/:userid" component={Chapter} />
        <Route path="/managepdf/:chapterid" component={Managepdf} />
        <Route path="/lecture-student/:pdfid" component={Teacherlecturestudent} />
        <Route path="/student-chapter/:userid" component={Studentchapter} />
        <Route path="/student-pdf/:userid/:chapterid" component={StudentPdf} />
        <Route path="/student-lecture/:userid/:lectureid" component={Studentlecture} />
        <Route path="/question/:pdfid" component={Question} />
      </div>
    )
  }
}

export default Routes

