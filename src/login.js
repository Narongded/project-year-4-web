import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import { Grid, Box, MenuItem, Select, InputLabel, Button, Card, TextField } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import './login.css';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: '',
      type: null,
      status: '',
      checkpassword: true,
    }
  }

  handleClick = async (event) => {

    if (this.state.type) {
      const apiBaseUrl = "http://localhost:3001/regis";
      const payload = {
        "first_name": this.state.first_name,
        "last_name": this.state.last_name,
        "email": this.state.email,
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
      }).then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
         
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else {
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
              alert(error)
            }

          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
  componentDidMount() {

  }
  render() {

    return (
      <div className="main">
        <Card className='card'>
          <MuiThemeProvider s>
            <div style={{ textAlign: 'center' }}>
              {this.state.type === true ?
                <div style={{ paddingTop: '100px' }}>
                  <p>สมัครสมาชิก</p>
                  <TextField
                    autoFocus
                    size={'small'}
                    margin="normal"
                    label="ชื่อจริง"
                    onChange={event => this.setState({ first_name: event.target.value })}
                    variant="outlined"
                  />
                  <br />
                  <TextField
                    autoFocus
                    size={'small'}
                    margin="normal"
                    label="นามสกุล"
                    onChange={(event, newValue) => this.setState({ last_name: event.target.value })}
                    variant="outlined"
                  />
                  <br />
                  <TextField
                    autoFocus
                    size={'small'}
                    margin="normal"
                    label="Email"
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
                    label="Password"
                    type="password"
                    onChange={(event, newValue) => this.setState({ password: event.target.value })}
                    variant="outlined"
                  />
                     <br />
                  <TextField
                    autoFocus
                    size={'small'}
                    margin="normal"
                    label="Confirm Password"
                    type="password"
                    onChange={(event, newValue) => event.target.value === this.state.password ? this.setState({ checkpassword: true }) : this.setState({ checkpassword: false })}
                    variant="outlined"
                  />
                  <br />
                  {this.state.checkpassword === false ? <InputLabel htmlFor="age-native-simple" style={{ color: 'red' }} >Wrong Email or Password</InputLabel> : null}
                  <br />
                  <InputLabel htmlFor="age-native-simple">Role</InputLabel>
                  <Select
                    native
                    value={this.state.role}
                    onChange={(event) => this.setState({ role: event.target.value })}
                    inputProps={{
                      name: 'role',
                      id: 'age-native-simple',
                    }}
                  >
                    <option aria-label="None" value="" />
                    <option value={'teacher'}>teacher</option>
                    <option value={'student'}>student</option>
                  </Select>
                </div>
                :
                <div style={{ paddingTop: '200px' }}>
                  <p>ลงชื่อเข้าสู่ระบบ</p>
                  <TextField

                    autoFocus
                    size={'small'}
                    margin="normal"
                    label="Email"
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
                    label="password"
                    type="password"
                    floatingLabelText="Password"
                    onChange={(event, newValue) => this.setState({ password: event.target.value })}
                    variant="outlined"
                  />
                </div>
              }
              <RaisedButton label="Submit" primary={true} style={{ marginTop: '17px' }} onClick={(event) => this.handleClick(event)} />
              <br />
   
              {this.state.status === false ? <InputLabel htmlFor="age-native-simple" style={{ color: 'red' }} >Wrong Email or Password</InputLabel> : null}
              <br />
              <Button size="small" value="" onClick={() => this.setState({ type: false })}>
                Login
                </Button>
              <Button size="small" value="" onClick={() => this.setState({ type: true })}>
                Register
                </Button>
            </div>
            <br />
          </MuiThemeProvider>
        </Card>

      </div>
    );
  }
}


export default Login;
