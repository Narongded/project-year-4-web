import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Grid, MenuItem, Select, InputLabel } from '@material-ui/core';
class Regis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: ''
    }
  }
  handleClick = async (event) => {
    var apiBaseUrl = "http://localhost:4000/api/";
    var self = this;
    var payload = {
      "first_name": this.state.first_name,
      "last_name": this.state.last_name,
      "email": this.state.email,
      "password": this.state.password
    }
    await fetch('http://localhost:3000/regis', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
  }
  render() {
    return (
      <div>
        <Grid container direction="row" >
          <Grid item xs={12}>
            <MuiThemeProvider >
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
                {console.log(this.state.role)}

                  <br />
                  <InputLabel htmlFor="age-native-simple">Age</InputLabel>
                  <br />
                  <Select
                    native
                    value={this.state.role}
                    onChange={(event) => this.setState({ role: event.target.value })}
                    size={'small'}
                    inputProps={{
                      name: 'age',
                      id: 'age-native-simple',
                    }}
                  >
                    <option aria-label="None" value="" />
                    <option value={10}>Ten</option>
                    <option value={20}>Twenty</option>
                    <option value={30}>Thirty</option>
                  </Select>
                </div>
                <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)} />
            </MuiThemeProvider>
          </Grid>
        </Grid>
      </div>
    );
  }
}
const style = {
  margin: 15,
};

export default Regis;
