import * as React from 'react';
import { Redirect } from "react-router-dom";
import Slidebar from './components/slideBar';
import {
    AppBar, IconButton, Toolbar, Button, Grid,
    TextField, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TableContainer, Table, TableBody, TableCell,
    TableHead, TableRow, Paper, TableFooter, TablePagination, InputAdornment
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Container from '@material-ui/core/Container';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SearchIcon from '@material-ui/icons/Search';

class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            loadchapter: [],
            profile: [],
            filter: '',
            rowperpage: 5,
            page: 0
        }
    }
    handleRedirect = async (page, userid, cid, name) => {
        if (page === 'searchpdf') this.props.history.push({
            pathname: `/managepdf/${cid}`,
            state: { name: userid, chapter: name }
        })
        if (page === 'searchprofile') this.props.history.push({
            pathname: `/student-chapter/${userid}`,
            state: { name: userid }
        })
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

    searchProfile = async (studentid) => {
        if (studentid) {
            const apiBaseUrl = `http://localhost:3001/user/getchapter/${studentid}`;
            await fetch(apiBaseUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }

            }).then((res) => res.json())
                .then((res) => {
                    this.setState({ profile: res.data })
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            this.setState({ profile: [] })
            this.loadChapter()
        }
    }

    componentDidMount() {
        this.loadChapter()
    }

    render() {
        return (
            <Container maxWidth="lg">
                <Slidebar prop={this.props} appBarName='Search Lecture Notes' openSlide={true} />
                <Grid item lg={12} style={{ marginBottom: 20, textAlign: 'right' }}>
                    <TextField
                        size={'small'}
                        margin="normal"
                        label="Search by Student ID"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button onClick={() => this.searchProfile(this.state.search)}>
                                        <SearchIcon color="action" />
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                        onChange={(e) => this.setState({ search: e.target.value })}
                        variant="outlined"
                    />
                </Grid>
                <TableContainer component={Paper}>
                    <Grid item lg={12} style={{ marginLeft: 15 }}>
                        <TextField
                            autoFocus
                            size={'small'}
                            margin="normal"
                            label="Filter Table"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={(e) => this.setState({ filter: e.target.value })}
                            variant="outlined"
                        />
                    </Grid>
                    <Table aria-label="simple table" >
                        {this.state.profile.length === 0 ?
                            <React.Fragment>
                                <TableHead>
                                    <TableRow>
                                        <TableCell> <b> Subjects </b></TableCell>
                                        <TableCell align="center"><b>Lecture Notes</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(this.state.rowperpage > 0 ?
                                        this.state.loadchapter.filter(data => data.subjectid.toLowerCase().includes(this.state.filter.toLowerCase()) || data.name.toLowerCase().includes(this.state.filter.toLowerCase()))
                                            .sort(() => this.state.order)
                                            .slice(this.state.page * this.state.rowperpage,
                                                this.state.page * this.state.rowperpage + this.state.rowperpage)
                                        : this.state.loadchapter
                                    ).map((value, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                {value.subjectid} {value.name} ({value.semester}/{value.year})
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button className="Button-table" onClick={() => this.handleRedirect('searchpdf', value.teacher, value.cid, value.subjectid + ' ' + value.name + ' (' + value.semester + '/' + value.year + ')')}>
                                                    <InsertDriveFileOutlinedIcon color="action" /> &nbsp;
                                                    All Lecture Notes
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <TableHead>
                                    <TableRow>
                                        <TableCell> <b> Student ID </b></TableCell>
                                        <TableCell align="center"><b>Go to Profile</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(this.state.rowperpage > 0 ?
                                        this.state.profile.filter((ele, ind) => ind === this.state.profile.findIndex(elem => elem.alluser_uid === ele.alluser_uid) && ele.alluser_uid.toLowerCase().includes(this.state.filter.toLowerCase()))
                                            .sort(() => this.state.order)
                                            .slice(this.state.page * this.state.rowperpage,
                                                this.state.page * this.state.rowperpage + this.state.rowperpage)
                                        : this.state.profile
                                    ).map((value, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                {value.alluser_uid}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button className="Button-table" onClick={() => this.handleRedirect('searchprofile', value.alluser_uid)}>
                                                    <AccountBoxIcon color="action" /> &nbsp;
                                                    Profile
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </React.Fragment>
                        }
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

export default Search

