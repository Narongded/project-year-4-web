import * as React from 'react';
import { Route, Redirect } from 'react-router-dom'
import {
    AppBar, IconButton, Toolbar, Button, Grid,
    TextField, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TableFooter, TablePagination, TableContainer, Table, TableBody, TableCell,
    TableHead, TableRow, Paper
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Container from '@material-ui/core/Container';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import { FeaturedPlayList } from '@material-ui/icons';
class Permission extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loadchapter: [],
            rowperpage: 5,
            page: 0,
            visitorstatus: false,
            sharedtoggleid: null

        }
    }

    loadChapter = async () => {
        const apiBaseUrl = `http://localhost:3001/user/getchapter/${this.props.prop.match.params.userid}`;
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

    handleSendemail = () => {
        const apiBaseUrl = `http://localhost:3001/setting/request-shared/${this.state.sharedtoggleid}`
        fetch(apiBaseUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email": localStorage.getItem('email'),
                'owner': this.props.prop.match.params.userid
            })
        }).then((res) => res.json())
            .then((res) => {
                
                // this.setState({ loadchapter: res.data })
                this.loadSetting()

            })
            .catch((error) => {
                console.error(error);
            });
    }
    handleCheckuser = () => {
        if ((this.props.prop.match.params.userid !== localStorage.getItem('email')) && localStorage.getItem('role') !== 'teacher') {
            const apiBaseUrl = `http://localhost:3001/setting/check-permission`
            fetch(apiBaseUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'owner': this.props.prop.match.params.userid,
                    'visitor': localStorage.getItem('email')
                })
            }).then((res) => res.json())
                .then((res) => {
                    if ((res.toggleid[0].statusshared === 0) && (!res.data[0] || res.data[0].status === 0)) {
                        this.setState({ visitorstatus: !false, sharedtoggleid: res.toggleid[0].sharedtoggleid })
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }
    componentDidMount() {
        this.handleCheckuser()
    }

    render() {
        return (
            <Dialog
                open={this.state.visitorstatus}
                // onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Let Google help apps determine location. This means sending anonymous location data to
                        Google, even when no apps are running.
              </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => {
                        this.props.prop.history.push({
                            pathname: '/login'
                        })
                    }}>
                        Disagree
                    </Button>
                    <Button color="primary" onClick={() => {
                        this.handleSendemail()
                    }} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default Permission

