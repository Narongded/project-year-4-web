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
        const apiBaseUrl = `http://localhost:3001/user/getdata-lecture/${localStorage.getItem('email')}/${this.props.match.params.chapterid}`;
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
                <TableContainer component={Paper}>
                    <Button variant="contained" color="primary" style={{ marginTop: '50px' }} >
                        อัปโหลดเอกสารบทเรียน
                    </Button>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>รายการเอกสารบทเรียน</TableCell>
                                <TableCell>ดูเลคเชอร์</TableCell>
                                <TableCell>ดูคำถามและคำตอบ</TableCell>
                                <TableCell>คลิปเสียงและวิดีโอ</TableCell>
                                <TableCell align="right">ลบ</TableCell>
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
                                    <TableCell>
                                        <Button color="primary"
                                            onClick={() => {
                                                this.props.history.push({
                                                    pathname: `/student-lecture/${this.props.match.params.userid}/${value.teacherpdf_tpid}`,
                                                    state: { pdfpath: value.spdfname, userid: value.alluser_uid }
                                                })
                                            }}
                                        >
                                            ดูเลคเชอร์
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button color="primary" 
                                            onClick={() => {
                                                this.props.history.push({
                                                    pathname: `/question/${value.tpid}`
                                                })
                                            }}>
                                            ดูคำถามและคำตอบ
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button color="primary" >
                                            ดูไฟล์เสียงและวิดีโอ
                                        </Button>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button color="primary" onClick={() => this.handleClickOpen('delete', value.spid)}>
                                            ลบ
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

