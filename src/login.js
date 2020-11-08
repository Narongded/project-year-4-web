import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Grid, MenuItem, Select, InputLabel, Button } from '@material-ui/core';
import { useHistory } from "react-router-dom";
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
      status: ''
    }
  }

  handleClick = async (event) => {

    if (this.state.type) {
      const apiBaseUrl = "http://localhost:3000/regis";
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
      const apiBaseUrl = "http://localhost:3000/login";
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
              if(res.data.role === 'teacher') this.props.history.push(`/chapter/${res.data.uid}`);
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
      <div>
        <Grid container direction="row"  >
          <Grid item xs={12}>
            <MuiThemeProvider >
              <div style={{ textAlign: 'left' }}>
                {this.state.type === true ?
                  <div>
                    <TextField
                      hintText="Enter your First Name"
                      floatingLabelText="First Name"
                      onChange={(event, newValue) => this.setState({ first_name: newValue })}
                    />
                    <br />
                    <TextField
                      hintText="Enter your Last Name"
                      floatingLabelText="Last Name"
                      onChange={(event, newValue) => this.setState({ last_name: newValue })}
                    />
                    <br />
                    <TextField
                      hintText="Enter your Email"
                      type="email"
                      floatingLabelText="Email"
                      onChange={(event, newValue) => this.setState({ email: newValue })}
                    />
                    <br />
                    <TextField
                      type="password"
                      hintText="Enter your Password"
                      floatingLabelText="Password"
                      onChange={(event, newValue) => this.setState({ password: newValue })}
                    />
                    <br />
                    <br />
                    <InputLabel htmlFor="age-native-simple">Role</InputLabel>
                    <br />
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
                  <div>
                    <br />
                    <TextField
                      hintText="Enter your Email"
                      type="email"
                      floatingLabelText="Email"
                      onChange={(event, newValue) => this.setState({ email: newValue })}
                    />
                    <br />
                    <TextField
                      type="password"
                      hintText="Enter your Password"
                      floatingLabelText="Password"
                      onChange={(event, newValue) => this.setState({ password: newValue })}
                    />

                  </div>
                }

                <br />
                <RaisedButton label="Submit" primary={true} style={{ marginTop: '17px' }} onClick={(event) => this.handleClick(event)} />
                <br />
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
          </Grid>
        </Grid>
      </div>
    );
  }
}


export default Login;
