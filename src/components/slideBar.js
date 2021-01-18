import React, { Component } from 'react'

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Grid, MenuItem, Select, InputLabel, Button, Card, TextField } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Menu from '@material-ui/core/Menu';
class Slidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      test: false,
    }
  }

  componentDidMount() {

  }
  handleOpen = (value) => {

  }
  render() {
    return (
      <div >

        <AppBar position="fixed">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => this.setState({ test: true })} >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">
              Photos
          </Typography>

            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem>Profile</MenuItem>
                <MenuItem >My account</MenuItem>
              </Menu>
            </div>

          </Toolbar>
        </AppBar>
        <Drawer
          variant="temporary"
          anchor="left"
          open={this.state.test}
          onClick={() => this.setState({ test: false })}
          style={{ width: '250px' }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <div style={{ width: '250px' }}>
            <Button onClick={()=> alert('asd') }>asdas</Button>
            <p>asdsad</p>
            <p>asdsad</p><p>asdsad</p>
            <p>asdsad</p><p>asdsad</p>
            <p>asdsad</p>
          </div>
        </Drawer>
      </div>
    )
  }
}

export default Slidebar