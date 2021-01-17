import * as React from 'react';
import './App.css';
import { Redirect } from "react-router-dom";
import Slidebar from './components/slideBar';
import { AppBar,IconButton, Toolbar, Button, Grid, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
class Chapter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            chaptername: '',
            loadchapter: []
        }
    }

    createChapter = async () => {
        const apiBaseUrl = "http://localhost:3001/admin/create-chapter";
        const payload = {
            "chaptername": this.state.chaptername,
            "uid": localStorage.getItem('uid')

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
                this.loadChapter()
            })
            .catch((error) => {
                console.error(error);
            });
    }
    loadChapter = async () => {
        const apiBaseUrl = `http://localhost:3001/admin/getall-chapter/${localStorage.getItem('uid')}`;
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
    handleClickOpen = () => {
        this.setState({
            open: true
        })
    };
    handleRedirect = (page, chapterid) => {
        if (page === 'managepdf') this.props.history.push(`/managepdf/${chapterid}`);
    }
    handleClose = () => {
        this.setState({
            open: false
        })
        this.createChapter()
    };
    componentDidMount() {
        this.loadChapter()

    }
    render() {
        return (
            <div class="container" >
                <Slidebar>
                </Slidebar>
                    <Button variant="contained" color="primary" style = {{marginTop : '50px'}}onClick={this.handleClickOpen}>
                        Create chapter
                     </Button>
     
                <Dialog open={this.state.open} onClose={false} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">บทเรียน</DialogTitle>
                    <DialogContent style={{ width: '250px' }}>
                        <TextField
                            id="outlined-full-width"
                            style={{ margin: 8 }}
                            placeholder="กรุณากรอกบทเรียน"
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(event) => { this.setState({ chaptername: event.target.value }) }}
                            variant="outlined"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ open: false })} color="primary">
                            Cancel
                         </Button>
                        <Button onClick={this.handleClose} color="primary">
                            Create
                         </Button>
                    </DialogActions>
                </Dialog>
                {this.state.loadchapter.map((value, index) => (
                    <div>
                        <p>{value.name}</p>
                        <Button color="primary" onClick={() => this.handleRedirect('managepdf', value.chapterid)}>
                            จัดการไฟล์
                        </Button>
                    </div>
                ))}
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1><h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>
                <h1>asdasdasd</h1>

            </div>
        )
    }
}

export default Chapter

