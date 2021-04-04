import * as React from 'react';
import { Redirect } from "react-router-dom";
import Slidebar from './components/slideBar';
import {
    ListItem, ListItemText, ListItemSecondaryAction, Button, Grid,
    Divider, Dialog, DialogActions, DialogContent,
    DialogContentText, IconButton, Checkbox, Table, TableBody, TableCell,
    TableHead, TableRow, List, Switch
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import MenuIcon from '@material-ui/icons/Menu';
import Container from '@material-ui/core/Container';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';

class Setting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            loadchapter: [],
            rowperpage: 5,
            page: 0,
            status: null
        }
    }
    handleRedirect = async (page, cid, userid) => {
        if (page === 'searchpdf') this.props.history.push({
            pathname: `/managepdf/${cid}`,
            state: { userid: userid }
        })
    }
    handleStatus = async (e) => {
        await e.target.checked === true ? this.setState({ status: 1 }) : this.setState({ status: 0 })
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
    loadChapter = async () => {
        const apiBaseUrl = `http://localhost:3001/user/getchapter/${this.props.match.params.userid}`;
        await fetch(apiBaseUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
            .then((res) => {
                this.setState({ loadchapter: res.data })
            })
            .catch((error) => {
                console.error(error);
            });
    }

    componentDidMount() {
        this.loadChapter()
    }

    render() {
        return (
            <Container maxWidth="lg">
                <Slidebar prop={this.props} appBarName='Search Lecture Notes' openSlide={true} />
                <Container maxWidth="md" style={{ backgroundColor: 'white' }}>

                    <List>
                        <p style={{ fontSize: '15pt', fontWeight: '600' }}>Setting</p>
                        <ListItem>
                            <ListItemText id="switch-list-label-wifi" primary="Shared" />
                            <ListItemSecondaryAction>
                                <Switch
                                    edge="end"
                                    onChange={(e) => this.handleStatus(e)}
                                    inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <p style={{ fontSize: '15pt', fontWeight: '600' }}>Shared With</p>
                        <ListItem>
                            <ListItemText id="switch-list-label-wifi" primary="it60070023" />
                            <ListItemSecondaryAction>
                                <IconButton aria-label="delete">
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                                {/* <Switch
                                    edge="end"
                                    // onChange={handleToggle('wifi')}
                                    // checked={checked.indexOf('wifi') !== -1}
                                    inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
                                /> */}
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </Container>
            </Container>

        )
    }
}

export default Setting

