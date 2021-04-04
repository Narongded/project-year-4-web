import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import {
  Grid, MenuItem, Select, InputLabel, ListItem,
  List, ListItemIcon, ListItemText, Button, Card, TextField, Divider, Avatar
} from '@material-ui/core';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import Drawer from '@material-ui/core/Drawer';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MailIcon from '@material-ui/icons/Mail';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
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
        <AppBar position="fixed" style={{ backgroundColor: '#ffffff' }}>
          <Toolbar>
            {this.props.openSlide &&
              <IconButton edge="start" style={{ color: '#8d8d8d' }} aria-label="menu" onClick={() => this.setState({ openDrawer: true })} >
                <MenuIcon />
              </IconButton>
            }
            <Typography variant="h6" style={{ flexGrow: 1, color: '#e75107' }}>
              {this.props.appBarName}
            </Typography>

            <div style={{
              paddingLeft: '2%', background: 'linear-gradient(0deg, rgba(242,75,123,1) 0%, rgba(231,81,7,1) 47%)',
              borderRadius: '10px', boxShadow: '2px 2px 12px rgb(0 0 0 / 18%)'
            }}>
              <span id="name">{localStorage.getItem('firstname')} {localStorage.getItem('lastname')}</span>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              {/* <Menu
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
              </Menu> */}
            </div>

          </Toolbar>
        </AppBar>
        {
          this.props.openSlide &&
          <Drawer
            variant="temporary"
            anchor="left"
            open={this.state.openDrawer}
            onClose={() => this.setState({ openDrawer: false })}
            style={{ width: '250px' }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <div style={{ width: '250px' }}>
              <p></p>
              <Divider />
              <List>
                <ListItem button key={"Home"} onClick={() => {
                  this.props.prop.history.push({
                    pathname: '/login'
                  })
                }} >
                  <ListItemIcon><HomeOutlinedIcon /></ListItemIcon>
                  <ListItemText primary={"Home"} />
                </ListItem>
                <ListItem button key={"Search Lecture Notes"} onClick={() =>
                  this.props.prop.history.push({
                    pathname: `/search/${localStorage.getItem('email')}`
                  })}>
                  <ListItemIcon><SearchOutlinedIcon /></ListItemIcon>
                  <ListItemText primary={"Search Lecture Notes"} />
                </ListItem>
                <ListItem button key={"Setting"} onClick={() =>
                  this.props.prop.history.push({
                    pathname: `/setting/${localStorage.getItem('email')}`
                  })}>
                  <ListItemIcon><SettingsOutlinedIcon /></ListItemIcon>
                  <ListItemText primary={"Setting"} />
                </ListItem>
                <Divider />
                <br />
                <ListItem button key={"Logout"} onClick={this.handleRedirec} >

                  <ListItemText primary={"Logout"} />
                </ListItem>
              </List>
            </div>
          </Drawer>
        }
      </div >
    )
  }
}

export default Slidebar