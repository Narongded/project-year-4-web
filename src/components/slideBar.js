import * as React from 'react';
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
import './slidebar.css';
class Slidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openDrawer: false,
      AnchorEl: null,
    }
    this.checkAuthen()
  }
  checkAuthen = () => {

    const token = localStorage.getItem('token')

    fetch('http://localhost:3001/checktoken', {
      method: 'GET',
      headers: {
        'Authorization': `${token}`
      }
    }).then((res) => {
      if (!res.ok) {
        localStorage.clear()
        this.props.prop.history.push({
          pathname: '/login',
          state: { path: this.props.prop.location.pathname }
        })
      }

    })

  }
  handleRedirec = () => {
    localStorage.clear()
    this.props.prop.history.push({
      pathname: '/login'
    })
  }
  componentDidMount() {

  }
  handleOpen = (value) => {

  }
  handleMenu = (event) => {
    this.setState({ AnchorEl: event.currentTarget });
  };

  render() {

    return (
      <div className='mainslideBar' style={{ marginBottom: '80px' }} >
        <AppBar position="fixed" style={{ backgroundColor: '#e65100' }}>
          <Toolbar>
            {this.props.openSlide &&
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => this.setState({ openDrawer: true })} >
              <MenuIcon />
            </IconButton>
            }
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              {this.props.appBarName}
            </Typography>

            <div>
              <span id="name">{localStorage.getItem('firstname')} {localStorage.getItem('lastname')}</span>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={this.handleMenu}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={this.state.AnchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={this.state.AnchorEl}
                onClose={() => this.setState({ AnchorEl: null })}
              >
                <MenuItem onClick={this.handleRedirec}>Logout</MenuItem>
              </Menu>
            </div>

          </Toolbar>
        </AppBar>
        {this.props.openSlide &&
        <Drawer
          variant="temporary"
          anchor="left"
          open={this.state.openDrawer}
          onClick={() => this.setState({ openDrawer: false })}
          style={{ width: '250px' }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <div style={{ width: '250px' }}>
            <Button onClick={() => alert('asd')}>asdas</Button>
            <p>asdsad</p>
            <p>asdsad</p><p>asdsad</p>
            <p>asdsad</p><p>asdsad</p>
            <p>asdsad</p>
          </div>
        </Drawer>
        }
      </div>
    )
  }
}

export default Slidebar