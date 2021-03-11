import * as React from 'react';

import SlideBar from './components/slideBar'
import { Redirect } from "react-router-dom";
import {
    AppBar, IconButton, Toolbar, Button, Grid,
    TextField, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TableFooter, TablePagination, TableContainer, Table, TableBody, TableCell,
    TableHead, TableRow, Paper
} from '@material-ui/core';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import LinkOutlinedIcon from '@material-ui/icons/LinkOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

import Container from '@material-ui/core/Container';

class Managepdf extends React.Component {
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
    uploadPdf = async () => {
        const apiBaseUrl = "http://localhost:3001/admin/upload-pdf";
        const payload = {
            "chaptername": this.state.chaptername,

        }

        const formData = new FormData();
        formData.append('pdfname', this.state.pdfname);
        formData.append('file', this.state.file);
        formData.append('role', localStorage.getItem('role'));
        formData.append('chapterid', this.props.match.params.chapterid);
        formData.append('alluser_uid', localStorage.getItem('email'));

        await fetch(apiBaseUrl, {
            method: 'POST',
            body: formData
        }).then((res) => res.json())
            .then((res) => {
                this.loadPdf()
            })
            .catch((error) => {
                console.error(error);
            });
    }

    loadPdf = async () => {
        const apiBaseUrl = `http://localhost:3001/admin/getfile-pdf/${this.props.match.params.chapterid}`;
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
        const apiBaseUrl = `http://localhost:3001/admin/delete-pdf/${pdfid}`;
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

    handleClickOpen = (dialogType, pdfid) => {
        this.setState({
            open: true,
            dialogType: dialogType,
            pdfid: pdfid
        })
    };

    handleClose = (page, pdfid) => {
        this.setState({
            open: false
        })
        console.log(pdfid)
        if (page === 'create') {
            if (this.state.pdfname !== '') {
                this.uploadPdf()
            }
        }
        if (page === 'delete') {
            this.deletePdf(pdfid)
        }
        this.setState({ fileName: null })
    };

    componentDidMount() {
        this.loadPdf()

    }
    render() {
        return (
            <Container maxWidth="lg">
                <SlideBar prop={this.props} openSlide={true} appBarName='เอกสารบทเรียน' />
                <Dialog open={this.state.open} onClose={false} aria-labelledby="form-dialog-title">
                    {this.state.dialogType !== 'delete' ?
                        <div>
                            <DialogTitle id="form-dialog-title">ชื่อบทเรียน</DialogTitle>
                            <DialogContent style={{ width: '250px' }}>
                                <TextField
                                    id="outlined-full-width"
                                    placeholder="กรุณากรอกชื่อบทเรียน"
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={(event) => { this.setState({ pdfname: event.target.value }) }}
                                    variant="outlined"
                                />
                            </DialogContent>
                            <DialogContent style={{ width: '250px' }}>
                                <input
                                    accept="application/pdf"
                                    style={{ display: 'none' }}
                                    id="contained-button-file"
                                    multiple
                                    type="file"
                                    onChange={(event) =>
                                        event.target.files[0] === undefined ?
                                            this.setState({ file: null, fileName: null })
                                            :
                                            this.setState({ file: event.target.files[0], fileName: event.target.files[0].name })}
                                />
                                <label htmlFor="contained-button-file">
                                    <Button variant="contained" color="primary" component="span">
                                        เลือกเอกสาร
                                </Button>
                                    {this.state.fileName ? " : " + this.state.fileName : null}
                                </label>
                            </DialogContent>
                        </div>
                        :
                        <DialogTitle id="form-dialog-title">ต้องการลบเอกสารบทเรียน</DialogTitle>
                    }
                    <DialogActions>
                        <Button onClick={() => this.setState({ open: false })} color="primary">
                            ยกเลิก
                        </Button>
                        {this.state.dialogType === 'create' ?
                            <Button onClick={() => this.handleClose('create')} color="primary">
                                อัปโหลด
                        </Button>
                            :
                            <Button onClick={() => this.handleClose('delete', this.state.pdfid)} color="primary" autoFocus>
                                ตกลง
                        </Button>
                        }

                    </DialogActions>
                </Dialog>
                <Button variant="contained" color="primary" style={{ marginBottom: '10px' }}  onClick={() => this.handleClickOpen('create')}>
                    อัปโหลดเอกสารบทเรียน
                    </Button>
                <TableContainer component={Paper}>


                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell><b>รายการเอกสารบทเรียน</b></TableCell>
                                <TableCell align="center"><b>ดูเลคเชอร์</b></TableCell>
                                <TableCell align="center"><b>ดูคำถาม</b></TableCell>
                                <TableCell align="center"><b>Link เปิดเอกสารบทเรียน</b></TableCell>
                                <TableCell align="center"><b>ลบ</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(this.state.rowperpage > 0 ? this.state.loadPdf.slice(this.state.page * this.state.rowperpage, this.state.page * this.state.rowperpage + this.state.rowperpage)
                                : this.state.loadPdf
                            ).map((value, index) => (
                                <TableRow key={index}>
                                    <TableCell >
                                        {value.pdfname}
                                    </TableCell>
                                    <TableCell align="center">

                                        <Button color="primary"
                                            onClick={() =>
                                                this.props.history.push({
                                                    pathname: `/lecture-student/${value.tpid}`,
                                                    state: { pdfpath: value.spdfname }
                                                })
                                            }
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
                                            <HelpOutlineOutlinedIcon color="action" /> &nbsp; ดูคำถาม
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button color="primary"
                                            onClick={() => navigator.clipboard.writeText(`http://localhost:3000/student/${value.tpid}`)}
                                        >
                                            <LinkOutlinedIcon color="action" /> &nbsp;คัดลอก
                                            </Button>

                                    </TableCell >
                                    <TableCell align="center">
                                        <Button color="primary" onClick={() => this.handleClickOpen('delete', value.tpid)}>
                                            <DeleteOutlinedIcon color="action" /> &nbsp;ลบ
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

export default Managepdf

