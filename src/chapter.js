import * as React from 'react';
import { Redirect } from "react-router-dom";
import Slidebar from './components/slideBar';
import {
    AppBar, IconButton, Toolbar, Button, Grid,
    TextField, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TableContainer, Table, TableBody, TableCell,
    TableHead, TableRow, Paper
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Container from '@material-ui/core/Container';

class Chapter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            delete: false,
            chapterid: '',
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
    handleClickDelete = (chapterid) => {
        this.setState({
            delete: true,
            chapterid: chapterid
        })
    }
    handleRedirect = async (page, chapterid) => {
        if (page === 'managepdf') this.props.history.push(`/managepdf/${chapterid}`);

        if (page === 'delete') {
        const apiBaseUrl = `http://localhost:3001/admin/delete-chapter/${chapterid}`;
        await fetch(apiBaseUrl, {
            method: 'DELETE'
        }).then((res) => res.json())
            .then((res) => {
                this.loadChapter()
                this.setState({ delete: false })
            })
            .catch((error) => {
                console.error(error);
            });
        }
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
            <Container maxWidth="lg">
                    <Slidebar prop={this.props} />
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

                    <Dialog
                        open={this.state.delete}
                        onClose={false}
                        aria-labelledby="alert-dialog-title"
                    >
                        <DialogTitle id="alert-dialog-title">{"ต้องการลบวิชา?"}</DialogTitle>
                        <DialogActions>
                        <Button onClick={() => this.setState({ delete: false })} color="primary">
                            ยกเลิก
                        </Button>
                        <Button onClick={() => this.handleRedirect('delete', this.state.chapterid)} color="primary" autoFocus>
                            ตกลง
                        </Button>
                        </DialogActions>
                    </Dialog>

                    <TableContainer component={Paper} >
                        <Button variant="contained" color="primary" style={{ marginTop: '50px' }} onClick={this.handleClickOpen}>
                            Create chapter
                     </Button>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>รายการวิชาบทเรียน</TableCell>
                                    <TableCell align="right">จัดการไฟล์บทเรียน</TableCell>
                                    <TableCell align="right">แก้ไขบทเรียน</TableCell>
                                    <TableCell align="right">ลบ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.loadchapter.map((value, index) => (
                                    <TableRow key={value.name}>
                                        <TableCell component="th" scope="row">
                                            {value.name}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button color="primary" onClick={() => this.handleRedirect('managepdf', value.chapterid)}>
                                                จัดการไฟล์
                                        </Button>
                                        </TableCell>
                                        <TableCell align="right">''</TableCell>
                                        <TableCell align="right">
                                            <Button color="primary" onClick={() => this.handleClickDelete(value.chapterid)}>
                                                ลบ
                                            </Button>
                                        </TableCell>
                                    </TableRow>

                                ))}

                            </TableBody>
                        </Table>
                    </TableContainer>
            
            </Container>

        )
    }
}

export default Chapter

