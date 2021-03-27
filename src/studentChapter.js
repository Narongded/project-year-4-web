import * as React from 'react';
import { Redirect } from "react-router-dom";
import Slidebar from './components/slideBar';
import {
    AppBar, IconButton, Toolbar, Button, Grid,
    TextField, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TableFooter, TablePagination, TableContainer, Table, TableBody, TableCell,
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
            page: 0,

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
                <Slidebar prop={this.props} appBarName='Subjects' openSlide={true} />
                <TableContainer component={Paper} style={{ marginTop: '100px' }}>
                    <Table aria-label="simple table" >
                        <TableHead>
                            <TableRow>
                                <TableCell> <b> Subjects </b></TableCell>
                                <TableCell> <b> Teacher </b></TableCell>
                                <TableCell align="center"><b> Manage Lecture Notes </b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(this.state.rowperpage > 0 ? this.state.loadchapter.slice(this.state.page * this.state.rowperpage, this.state.page * this.state.rowperpage + this.state.rowperpage)
                                : this.state.loadchapter
                            ).map((value, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {value.name}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {value.teacher}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button color="primary" variant="outlined" onClick={() => this.handleRedirect('managepdf', value.cid)}>
                                            <InsertDriveFileOutlinedIcon color="action" /> &nbsp;
                                            <b> Manage</b>
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
                                    count={this.state.loadchapter.length}
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

export default Studentchapter

