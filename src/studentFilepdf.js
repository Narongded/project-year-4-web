import * as React from 'react';

import SlideBar from './components/slideBar'
import { Redirect } from "react-router-dom";
import {
    AppBar, IconButton, Toolbar, Button, Grid,
    TextField, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TableFooter, TablePagination, TableContainer, Table, TableBody, TableCell,
    TableHead, TableRow, Paper, Fab
} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
class StudentPdf extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            dialogType: null,
            pdfid: '',
            pdfname: '',
            loadPdf: [],
            sid: '',
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
    handleDelete = (sid) => {
        this.deletePdf(sid)
        this.setState({ confirmDialog: false })
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
                <SlideBar prop={this.props} openSlide={true} appBarName={'All ' + this.props.match.params.userid + ' Lecture Notes'} />
                <Dialog
                    open={this.state.confirmDialog}
                    onClose={false}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Remove This Lecture Notes?"}</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => this.setState({ confirmDialog: false })} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => this.handleDelete(this.state.sid)} color="primary">
                            Remove
                        </Button>
                    </DialogActions>
                </Dialog>
                <TableContainer component={Paper}  style={{ marginTop: '100px', borderRadius: '10px', background: 'white' }}>

                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Lecture Notes</b></TableCell>
                                <TableCell align="center"><b>View</b></TableCell>
                                <TableCell align="center"><b>Q&A</b></TableCell>
                                {localStorage.getItem('email') === this.props.match.params.userid
                                    ? <TableCell align="center"><b>Remove</b></TableCell>
                                    : null}
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
                                        <Button className="Button-table"
                                            onClick={() => {
                                                this.props.history.push({
                                                    pathname: `/student-lecture/${this.props.match.params.userid}/${value.teacherpdf_tpid}`,
                                                    state: { pdfpath: value.spdfname, userid: value.alluser_uid, pdfid: value.sid, pdfname: value.pdfname }
                                                })
                                            }}
                                        >
                                            <VisibilityOutlinedIcon color="action" /> &nbsp;
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button className="Button-table"
                                            onClick={() => {
                                                this.props.history.push({
                                                    pathname: `/question/${value.tpid}`
                                                })
                                            }}>
                                            <HelpOutlineOutlinedIcon color="action" /> &nbsp;
                                        </Button>
                                    </TableCell>
                                    {localStorage.getItem('email') === this.props.match.params.userid
                                        ? <TableCell align="center">
                                            <Button className="Button-table" onClick={() => this.setState({ confirmDialog: true, sid: value.sid })}>
                                                <DeleteOutlineIcon color="action" />
                                            </Button>
                                        </TableCell>
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

export default StudentPdf

