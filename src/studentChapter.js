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
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';

class Studentchapter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loadchapter: [],
            rowperpage: 5,
            page: 0
        }
    }
    handleRedirect = async (page, chapterid) => {
        if (page === 'managepdf') this.props.history.push(`/student-pdf/${this.props.match.params.userid}/${chapterid}`);
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
                <Slidebar prop={this.props} appBarName='วิชา' openSlide={true} />
                <TableContainer component={Paper} style={{ marginTop: '100px' }}>
                    <Table aria-label="simple table" >
                        <TableHead>
                            <TableRow>
                                <TableCell> <b> รายการวิชา </b></TableCell>
                                <TableCell align="center"><b> จัดการไฟล์เลคเชอร์</b></TableCell>
                                <TableCell align="center"><b> ลบ</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.loadchapter.map((value, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {value.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button color="primary" onClick={() => this.handleRedirect('managepdf', value.cid)}>
                                            <InsertDriveFileOutlinedIcon color="action" /> &nbsp;
                                            จัดการไฟล์
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
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

