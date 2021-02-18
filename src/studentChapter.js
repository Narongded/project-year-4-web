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

class Studentchapter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            dialogType: '',
            chapterid: '',
            chaptername: '',
            loadchapter: [],
            rowperpage: 5,
            page: 0
        }
    }

    loadChapter = async () => {
        const apiBaseUrl = `http://localhost:3001/user/getchapter/${localStorage.getItem('email')}`;
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

    handleRedirect = async (page, chapterid) => {
        if (page === 'managepdf') this.props.history.push(`/student-pdf/${localStorage.getItem('email')}/${chapterid}`);
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
                <Slidebar prop={this.props} appBarName='วิชา' openSlide={true} />
                <TableContainer component={Paper} >
                    <Table aria-label="simple table" style={{ marginTop: '80px' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>รายการวิชา</TableCell>
                                <TableCell align="right">จัดการไฟล์เลคเชอร์</TableCell>
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
                                        <Button color="primary" onClick={() => this.handleRedirect('managepdf', value.cid)}>
                                            จัดการไฟล์
                                        </Button>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button color="primary" onClick={() => this.handleClickOpen('delete', value.sid)}>
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

export default Studentchapter

