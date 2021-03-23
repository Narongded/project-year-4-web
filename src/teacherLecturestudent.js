import * as React from 'react';

import SlideBar from './components/slideBar'
import { Redirect } from "react-router-dom";
import {
    AppBar, IconButton, Toolbar, Button, Grid,
    TextField, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TableFooter, TablePagination, TableContainer, Table, TableBody, TableCell,
    TableHead, TableRow, Paper, InputAdornment
} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import SearchIcon from '@material-ui/icons/Search';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
class Teacherlecturestudent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loadlecturestudent: [],
            filter: '',
            rowperpage: 5,
            page: 0
        }
    }
    loadLectureStudent = async () => {
        const apiBaseUrl = `http://localhost:3001/admin/getdata-studentlecture/${this.props.match.params.pdfid}`;
        await fetch(apiBaseUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }

        }).then((res) => res.json())
            .then((res) => {
                this.setState({ loadlecturestudent: res.data })
            })
            .catch((error) => {
                console.error(error);
            });
    }
    searchChapter = async () => {

    }
    componentDidMount() {
        this.loadLectureStudent()

    }
    render() {
        return (
            <Container maxWidth="lg">
                <SlideBar prop={this.props} openSlide={true} appBarName='All Lecture Notes' />

                <TableContainer component={Paper} style={{ marginTop: '100px' }}>
                <Grid item lg={12} style={{ textAlign: 'right' }}>
                        <TextField
                            autoFocus
                            size={'small'}
                            margin="normal"
                            label="Search by Student ID"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={(e) => this.setState({ filter: e.target.value })}
                            floatingLabelText="Email"
                            variant="outlined"
                        />
                    </Grid>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Author</b></TableCell>
                                <TableCell align='center'><b>Lecture Notes</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(this.state.rowperpage > 0 ?
                                this.state.loadlecturestudent.filter(data => data.alluser_uid.toLowerCase().includes(this.state.filter))
                                .sort(() => this.state.order)
                                .slice(this.state.page * this.state.rowperpage,
                                    this.state.page * this.state.rowperpage + this.state.rowperpage)
                                : this.state.loadlecturestudent
                            ).map((value, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {value.alluser_uid}
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Button color="primary"
                                            onClick={() => {
                                                this.props.history.push({
                                                    pathname: `/student-lecture/${value.alluser_uid}/${value.teacherpdf_tpid}`,
                                                    state: { pdfpath: value.spdfname, userid: value.alluser_uid, pdfid: value.sid }
                                                })
                                            }}
                                        >
                                            <VisibilityOutlinedIcon color="action" /> &nbsp;
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
                                    count={this.state.loadlecturestudent.length}
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

export default Teacherlecturestudent

