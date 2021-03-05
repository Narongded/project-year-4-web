import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Grid, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, InputLabel, Button, Card, TextField } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import './login.css';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      studentnumber: '',
      role: '',
      type: null,
      status: '',
      checkpassword: true,
      dialog: false,
      mes: '',
    }

  }
  handleAuthenicate = () => {
    try {
      if (localStorage.getItem('role') === 'teacher') this.props.history.push(`/chapter/${localStorage.getItem('uid')}`);
      else if (localStorage.getItem('role') === 'student') this.props.history.push(`/student-chapter/${localStorage.getItem('email')}`);
    } catch (error) {

    }
  }
  handleClick = async (event) => {

    if (this.state.type) {
      if (this.state.first_name === '' || this.state.last_name === '' || this.state.email === ''
        || this.state.password === '' || this.state.role === '') {
        this.setState({ dialog: true, mes: 'กรุณากรอกข้อมูลให้ครบถ้วน' })
      } else if (this.state.role === 'นักศึกษา') {
        if (this.state.studentnumber === '') {
          this.setState({ dialog: true, mes: 'กรุณากรอกรหัสนักศึกษา' })
        }
      } else if (this.state.checkpassword === false) {
        this.setState({ dialog: true, mes: 'รหัสผ่านไม่ตรงกัน' })
      }
      else {
        const apiBaseUrl = "http://localhost:3001/regis";
        const payload = {
          "first_name": this.state.first_name,
          "last_name": this.state.last_name,
          "email": this.state.email,
          "studentnumber": this.state.studentnumber,
          "password": this.state.password,
          "role": this.state.role
        }
        fetch(apiBaseUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }).then((response) => response.json()
        ).then((responseJson) => {
          this.setState({ dialog: true, mes: responseJson.mes })
        })
          .catch((error) => {
            console.error(error);
          });
      }
    }
    else {
      if (this.state.email === '' || this.state.password === '') {
        this.setState({ dialog: true, mes: 'กรุณากรอกข้อมูลให้ครบถ้วน' })
      } else {
        const apiBaseUrl = "http://localhost:3001/login";
        const payload = {
          "email": this.state.email,
          "password": this.state.password,
        }
        await fetch(apiBaseUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }).then((res) => res.json())
          .then((res) => {
            if (res.status !== 'Success') this.setState({ status: false })
            else {
              this.setState({ status: true })
              localStorage.setItem('firstname', res.data.firstname);
              localStorage.setItem('lastname', res.data.lastname);
              localStorage.setItem('email', res.data.email);
              localStorage.setItem('role', res.data.role);
              localStorage.setItem('uid', res.data.uid);
              localStorage.setItem('token', res.token);
              try {
                if (res.data.role === 'teacher') this.props.history.push(`/chapter/${res.data.uid}`);
                else this.props.history.push(`${this.props.location.state.path}`);
              } catch (error) {
                if (res.data.role === 'teacher') this.props.history.push(`/chapter/${res.data.uid}`);
                else this.props.history.push(`/student-chapter/${res.data.email}`);
              }
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }
  componentDidMount() {
    this.handleAuthenicate()
  }
  render() {
    return (
      <div className="main">
        <Card className='card' style={{ backgroundColor: '#fbfbfb' }}>
          <MuiThemeProvider >
            <div style={{ textAlign: 'center' }}>
              <div className='cardlogin' >
                <h3>ลงชื่อเข้าสู่ระบบ</h3>
                <TextField
                  autoFocus
                  size={'small'}
                  margin="normal"
                  label="อีเมล"
                  type="email"
                  floatingLabelText="Email"
                  onChange={(event, newValue) => this.setState({ email: event.target.value })}
                  variant="outlined"
                />
                <br />
                <TextField
                  autoFocus
                  size={'small'}
                  margin="normal"
                  label="รหัสผ่าน"
                  type="password"
                  floatingLabelText="Password"
                  onChange={(event, newValue) => this.setState({ password: event.target.value })}
                  variant="outlined"
                />
                <br />
                {this.state.status === false ? [<br />, <InputLabel htmlFor="age-native-simple" style={{ color: 'red' }} >อีเมลหรือรหัสผ่านไม่ถูกต้อง</InputLabel>] : null}
              </div>
              <br />
              <Button classes={{ root: 'Button' }} onClick={(event) => this.handleClick(event)}>เข้าสู่ระบบ</Button>
              <br />
              <br />
            </div>
          </MuiThemeProvider>
        </Card>
        <div>
          <Dialog
            open={this.state.dialog}
            onClick={() => this.setState({ dialog: false })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{this.state.mes}</DialogTitle>

          </Dialog>
        </div>
      </div>
    );
  }
}


export default Login;
