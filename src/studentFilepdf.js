import * as React from 'react';

import SlideBar from './components/slideBar'
import { Redirect } from "react-router-dom";
import {
    AppBar, IconButton, Toolbar, Button, Grid,
    TextField, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TableFooter, TablePagination, TableContainer, Table, TableBody, TableCell,
    TableHead, TableRow, Paper
} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import VideoLibraryOutlinedIcon from '@material-ui/icons/VideoLibraryOutlined';
class StudentPdf extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            dialogType: null,
            pdfid: '',
            pdfname: '',
            loadPdf: [],
            file: null,
            fileName: null,
            rowperpage: 5,
            page: 0
        }
    }
    loadPdf = async () => {
        const apiBaseUrl = `http://localhost:3001/user/getdata-lecture/${this.props.match.params.userid}/${this.props.match.params.chapterid}`;
        await fetch(apiBaseUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }

        }).then((res) => res.json())
            .then((res) => {
                this.setState({ loadPdf: res.data })
            })
            .catch((error) => {
                console.error(error);
            });
    }

    deletePdf = async (pdfid) => {
        const apiBaseUrl = `http://localhost:3001/user/delete-pdf/${pdfid}`;
        await fetch(apiBaseUrl, {
            method: 'DELETE'
        }).then((res) => res.json())
            .then((res) => {
                this.loadPdf()
            })
            .catch((error) => {
                console.error(error);
            });
    }
    componentDidMount() {
        this.loadPdf()

    }
    render() {
        return (
            <Container maxWidth="lg">
                <SlideBar prop={this.props} openSlide={true} appBarName='เอกสารบทเรียน' />
                <TableContainer component={Paper} style={{ marginTop: '100px' }}>
            
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell><b>รายการเอกสารบทเรียน</b></TableCell>
                                <TableCell align="center"><b>ดูเลคเชอร์</b></TableCell>
                                <TableCell align="center"><b>ดูคำถามและคำตอบ</b></TableCell>
                                <TableCell align="center"><b>คลิปเสียงและวิดีโอ</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(this.state.rowperpage > 0 ? this.state.loadPdf.slice(this.state.page * this.state.rowperpage, this.state.page * this.state.rowperpage + this.state.rowperpage)
                                : this.state.loadPdf
                            ).map((value, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {value.pdfname}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button color="primary"
                                            onClick={() => {
                                                this.props.history.push({
                                                    pathname: `/student-lecture/${this.props.match.params.userid}/${value.teacherpdf_tpid}`,
                                                    state: { pdfpath: value.spdfname, userid: value.alluser_uid ,pdfid: value.sid }
                                                })
                                            }}
                                        >
                                            <VisibilityOutlinedIcon color="action" /> &nbsp;
                                            ดูเลคเชอร์
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button color="primary" 
                                            onClick={() => {
                                                this.props.history.push({
                                                    pathname: `/question/${value.tpid}`
                                                })
                                            }}>
                                                <HelpOutlineOutlinedIcon color="action" /> &nbsp;
                                                ดูคำถามและคำตอบ
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button color="primary" >
                                            <VideoLibraryOutlinedIcon color="action" /> &nbsp;
                                            ดูไฟล์เสียงและวิดีโอ
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={5}
                                    count={this.state.loadPdf.length}
                                    rowsPerPage={this.state.rowperpage}
                                    page={this.state.page}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'rows per page' },
                                        native: true,
                                    }}
                                    onChangePage={(event, newPage) => this.setState({ page: newPage })}
                                    onChangeRowsPerPage={(event) => this.setState({ rowperpage: parseInt(event.target.value, 10) })}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Container>
        )
    }
}

export default StudentPdf

