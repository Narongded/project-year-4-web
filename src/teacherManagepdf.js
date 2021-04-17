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
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

import Container from '@material-ui/core/Container';

class Managepdf extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            dialogType: null,
            copyDialog: false,
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

    updatePdf = async (pdfid) => {
        const apiBaseUrl = `http://localhost:3001/admin/update-pdf/${pdfid}`;
        const formData = new FormData();
        formData.append('pdfname', this.state.pdfname);

        if (this.state.file) {     
            formData.append('file', this.state.file);
        }

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
        if (page === 'create') {
            if (this.state.pdfname !== '' || !this.state.file) {
                this.uploadPdf()
            }
        }
        if (page === 'update') {
            if (this.state.pdfname !== '') {
                this.updatePdf(pdfid)
            }
        }
        if (page === 'delete') {
            this.deletePdf(pdfid)
        }
        this.setState({ file: null, fileName: null })
    };

    componentDidMount() {
        this.loadPdf()

    }
    render() {
        return (
            <Container maxWidth="lg" style={{ display: 'flex', flexDirection: 'column' }}>
                <SlideBar prop={this.props} openSlide={true} appBarName={this.props.location.state.chapter+' Lecture Slide'} />
                <Dialog open={this.state.open} onClose={false} aria-labelledby="form-dialog-title">
                    {this.state.dialogType !== 'delete' ?
                        <div>
                            <DialogTitle id="form-dialog-title">Lecture Slide Name</DialogTitle>
                            <DialogContent style={{ width: '250px' }}>
                                <TextField
                                    id="outlined-full-width"
                                    label="Lecture Slide Name"
                                    placeholder="Enter Slide Name"
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={this.state.pdfname ? this.state.pdfname :null}
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
                                        Choose File
                                </Button>
                                    {this.state.fileName ? " : " + this.state.fileName : null}
                                </label>
                            </DialogContent>
                        </div>
                        :
                        <DialogTitle id="form-dialog-title">Remove Chapter & Slide</DialogTitle>
                    }
                    <DialogActions>
                        <Button onClick={() => this.setState({ open: false, pdfname: '', file: null, fileName: null })} color="primary">
                            Cancel
                        </Button>
                        {this.state.dialogType === 'create' ?
                            <Button onClick={() => this.handleClose('create')} color="primary">
                                Upload
                        </Button>
                            : this.state.dialogType === 'update' ?
                                <Button onClick={() => this.handleClose('update', this.state.pdfid)} color="primary">
                                    Change
                                </Button>
                            :
                            <Button onClick={() => this.handleClose('delete', this.state.pdfid)} color="primary" autoFocus>
                                Remove
                        </Button>
                        }

                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.copyDialog} onClose={() => this.setState({ copyDialog: false })} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Copied</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => this.setState({ copyDialog: false })}>Close</Button>
                    </DialogActions>
                </Dialog>
                {localStorage.getItem('firstname')+' '+localStorage.getItem('lastname') === this.props.location.state.name ?
                    <Button variant="contained" color="primary" style={{ width: 'max-content', alignSelf: 'flex-end' }} onClick={() => this.handleClickOpen('create')}>
                        Upload PDF
                    </Button>
                : null}
                <TableContainer component={Paper} style={{ marginTop: '20px', borderRadius: '10px', background: 'white' }}> 


                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Lecture Slides</b></TableCell>
                                <TableCell align="center"><b>Student Lecture Notes</b></TableCell>
                                <TableCell align="center"><b>Q&A</b></TableCell>
                                {localStorage.getItem('firstname')+' '+localStorage.getItem('lastname') === this.props.location.state.name ?
                                    <React.Fragment>
                                        <TableCell align="center"><b>Link to PDF</b></TableCell>
                                        <TableCell align="center"><b>Edit</b></TableCell>
                                        <TableCell align="center"><b>Remove</b></TableCell>
                                    </React.Fragment>
                                : null}
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

                                    <Button className="Button-table"
                                            onClick={() =>
                                                this.props.history.push({
                                                    pathname: `/lecture-student/${value.tpid}`,
                                                    state: { pdfpath: value.spdfname, pdfname: value.pdfname }
                                                })
                                            }
                                        >
                                            <VisibilityOutlinedIcon color="action" /> 
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                    <Button className="Button-table"
                                            onClick={() => {
                                                this.props.history.push({
                                                    pathname: `/question/${value.tpid}`,
                                                    state: { pdfname: value.pdfname }
                                                })
                                            }}>
                                            <HelpOutlineOutlinedIcon color="action" /> 
                                        </Button>
                                    </TableCell>
                                    {localStorage.getItem('firstname')+' '+localStorage.getItem('lastname') === this.props.location.state.name ?
                                        <React.Fragment>
                                            <TableCell align="center">
                                            <Button className="Button-table"
                                                    onClick={() => {navigator.clipboard.writeText(`http://localhost:3000/student/${value.tpid}`); this.setState({ copyDialog: true }); }}
                                                >
                                                    <LinkOutlinedIcon color="action" /> 
                                                    </Button>

                                            </TableCell >
                                            <TableCell align="center">
                                            <Button className="Button-table"onClick={() => { this.handleClickOpen('update', value.tpid); this.setState({ pdfname: value.pdfname}) }}>
                                                    <EditOutlinedIcon color="action" /> 
                                                    </Button>

                                            </TableCell >
                                            <TableCell align="center">
                                            <Button className="Button-table" onClick={() => this.handleClickOpen('delete', value.tpid)}>
                                                    <DeleteOutlinedIcon color="action" /> 
                                                    </Button>
                                            </TableCell>
                                        </React.Fragment>
                                    : null}
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

