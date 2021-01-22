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
            dialogType: '',
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

    updateChapter = async (chapterid) => {
        const apiBaseUrl = `http://localhost:3001/admin/update-chapter/${chapterid}`;
        const payload = {
            "chaptername": this.state.chaptername
        }
        await fetch(apiBaseUrl, {
            method: 'PUT',
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

    deleteChapter = async (chapterid) => {
        const apiBaseUrl = `http://localhost:3001/admin/delete-chapter/${chapterid}`;
        await fetch(apiBaseUrl, {
            method: 'DELETE'
        }).then((res) => res.json())
            .then((res) => {
                this.loadChapter()
            })
            .catch((error) => {
                console.error(error);
            });
    }

    handleClickOpen = (dialogType, chapterid) => {
        this.setState({
            open: true,
            dialogType: dialogType,
            chapterid: chapterid
        })
    };

    handleRedirect = async (page, chapterid) => {
        if (page === 'managepdf') this.props.history.push(`/managepdf/${chapterid}`);
    }

    handleClose = (page, chapterid) => {
        this.setState({
            open: false
        })
        console.log(chapterid)
        if (page === 'create') {
            this.createChapter()
        } 
        if (page === 'update') {
            this.updateChapter(chapterid)
        }
        if (page === 'delete') {
            this.deleteChapter(chapterid)
        }
    };

    componentDidMount() {
        this.loadChapter()

    }

    render() {
        return (
            <Container maxWidth="lg">
                    <Slidebar prop={this.props} />
                    <Dialog open={this.state.open} onClose={false} aria-labelledby="form-dialog-title">
                        { this.state.dialogType !== 'delete' ?
                        <div>
                            <DialogTitle id="form-dialog-title">บทเรียน</DialogTitle>
                            <DialogContent style={{ width: '250px' }}>
                                <TextField
                                    id="outlined-full-width"
                                    style={{ margin: 8 }}
                                    placeholder="กรุณากรอกชื่อบทเรียน"
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={(event) => { this.setState({ chaptername: event.target.value }) }}
                                    variant="outlined"
                                />
                            </DialogContent>
                        </div>
                        :
                        <DialogTitle id="form-dialog-title">ต้องการลบบทเรียน</DialogTitle>
                        }
                        <DialogActions>
                            <Button onClick={() => this.setState({ open: false })} color="primary">
                                ยกเลิก
                            </Button>
                            { this.state.dialogType === 'create' ?
                            <Button onClick={() => this.handleClose('create')} color="primary">
                                สร้าง
                            </Button>
                            : this.state.dialogType === 'update' ?
                            <Button onClick={() => this.handleClose('update', this.state.chapterid)} color="primary">
                                แก้ไข
                            </Button>
                            :
                            <Button onClick={() => this.handleClose('delete', this.state.chapterid)} color="primary" autoFocus>
                                ตกลง
                            </Button>
                            }
                        </DialogActions>
                    </Dialog>

                    <TableContainer component={Paper} >
                        <Button variant="contained" color="primary" style={{ marginTop: '50px' }} onClick={() => this.handleClickOpen('create')}>
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
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                            {value.name}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button color="primary" onClick={() => this.handleRedirect('managepdf', value.chapterid)}>
                                                จัดการไฟล์
                                        </Button>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button color="primary" onClick={() => this.handleClickOpen('update', value.chapterid)}>
                                                แก้ไข
                                            </Button>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button color="primary" onClick={() => this.handleClickOpen('delete', value.chapterid)}>
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

