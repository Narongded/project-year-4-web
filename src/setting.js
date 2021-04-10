import * as React from 'react';
import { Redirect } from "react-router-dom";
import Slidebar from './components/slideBar';
import {
    ListItem, ListItemText, ListItemSecondaryAction, Button, Grid,
    Divider, Dialog, DialogActions, DialogContent,
    DialogContentText, IconButton, Checkbox, Table, TableBody, TableCell,
    TableHead, TableRow, List, Switch, Menu, MenuItem, Fade, TextField
} from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DialogTitle from '@material-ui/core/DialogTitle';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import Container from '@material-ui/core/Container';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import { ThreeSixtySharp } from '@material-ui/icons';

class Setting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            dialogadd: false,
            loadchapter: [],
            rowperpage: 5,
            page: 0,
            status: null,
            anchorEl: null,
            textemail: '',
            checked: null,
            confirmDialog: false,
            loadsettingstatus: [],
            loadsettingpeople: [],
            sharedlistid: null
        }
    }
    handleRedirect = async (page, cid, userid) => {
        if (page === 'searchpdf') this.props.history.push({
            pathname: `/managepdf/${cid}`,
            state: { userid: userid }
        })
    }
    handleStatus = async (e) => {
        await e.target.checked === true ? this.setState({ status: 1, checked: 1 }) : this.setState({ status: 0, checked: 0 })
        const apiBaseUrl = `http://localhost:3001/setting/shared/${this.props.match.params.userid}`
        await fetch(apiBaseUrl, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "status": this.state.status
            })
        }).then((res) => res.json())
            .then((res) => {
                // this.setState({ loadchapter: res.data })
            })
            .catch((error) => {
                console.error(error);
            });
    }
    loadSetting = () => {
        const apiBaseUrl = `http://localhost:3001/setting/loadSetting/${localStorage.getItem('email')}`;
        fetch(apiBaseUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
            .then((res) => {
                this.setState({ loadsettingstatus: res.statusshared, loadsettingpeople: res.data })
                if (this.state.loadsettingstatus) this.setState({ checked: this.state.loadsettingstatus[0].sharedtoggleid })
            })
            .catch((error) => {
                console.error(error);
            });
    }
    handleSendemail = () => {
        const apiBaseUrl = `http://localhost:3001/setting/add-people/${this.state.loadsettingstatus[0].sharedtoggleid}`
        fetch(apiBaseUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email": this.state.textemail,
                'owner': this.state.loadsettingstatus[0].alluser_uid
            })
        }).then((res) => res.json())
            .then((res) => {
                this.setState({ dialogadd: false, anchorEl: null })
                // this.setState({ loadchapter: res.data })
                this.loadSetting()

            })
            .catch((error) => {
                console.error(error);
            });
    }
    handleDeletepeople = () => {
        const apiBaseUrl = `http://localhost:3001/setting/delete-people/${this.state.sharedlistid}`
        fetch(apiBaseUrl, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
            .then((res) => {
                this.setState({ confirmDialog: false })
                this.loadSetting()
            })
            .catch((err) => console.log('err'))
    }
    componentDidMount() {
        this.loadSetting()
    }

    render() {
        return (
            <Container maxWidth="lg">
                <Slidebar prop={this.props} appBarName='Share Lecture Notes Settings' openSlide={true} />
                <Container maxWidth="md" style={{ backgroundColor: 'white' }}>

                    <List>
                        <br />
                        <span style={{ fontSize: '15pt', fontWeight: '600' }}>Setting</span>
                        <ListItem>
                            <ListItemText id="switch-list-label-wifi" primary="Shared" />
                            <ListItemSecondaryAction>
                                <Switch
                                    checked={this.state.checked === 1 ? true : false}
                                    edge="end"
                                    onChange={(e) => this.handleStatus(e)}
                                    inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <br />
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <span style={{ fontSize: '15pt', fontWeight: '600', flex: '0.98' }}>Shared With</span>
                            <IconButton
                                aria-controls="fade-menu" aria-haspopup="true"
                                onClick={(e) => this.setState({ anchorEl: e.currentTarget })}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="long-menu"
                                anchorEl={this.state.anchorEl}
                                keepMounted
                                open={Boolean(this.state.anchorEl)}
                                onClose={() => this.setState({ anchorEl: null })}
                                TransitionComponent={Fade}
                            >

                                <MenuItem onClick={() => this.setState({ dialogadd: true })}>
                                    Add Friend
                                </MenuItem>
                            </Menu>
                        </div>
                        {this.state.loadsettingpeople.length !== 0 &&
                            this.state.loadsettingpeople.map((value, index) =>
                                <ListItem>
                                    <ListItemText id="switch-list-label-wifi" primary={value.alluser_uid} />
                                    <ListItemSecondaryAction>
                                        <IconButton aria-label="delete" onClick={() => this.setState({ confirmDialog: true, sharedlistid: value.sharedlistid })}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )}
                    </List>
                </Container>
                <Dialog open={this.state.dialogadd} onClose={() => this.setState({ dialogadd: false })} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title" >
                        <span style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}> <PersonAddIcon color="primary" />  &nbsp;  Invite Friends</span>
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Username"
                            placeholder="Enter Friend Username"
                            type="email"
                            fullWidth
                            onChange={(e) => this.setState({ textemail: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ dialogadd: false })} color="primary">
                            Cancel
                         </Button>
                        <Button color="primary" onClick={() => this.handleSendemail()}>
                            Submit
                        </Button>
                    </DialogActions>

                </Dialog>
                <Dialog
                    open={this.state.confirmDialog}
                    onClose={!this.state.confirmDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Remove This Lecture Notes?"}</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => this.setState({ confirmDialog: false })} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => this.handleDeletepeople()} color="primary">
                            Remove
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container >

        )
    }
}

export default Setting

