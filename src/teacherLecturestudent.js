import * as React from 'react';

import SlideBar from './components/slideBar'
import { Redirect } from "react-router-dom";
import {
    AppBar, IconButton, Toolbar, Button, Grid,
    TextField, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TableFooter, TablePagination, TableContainer, Table, TableBody, TableCell,
    TableHead, TableRow, Paper, InputAdornment, TableSortLabel
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
            page: 0,
            typeOrder: null,
            orderBy: 'author',
            order: -1
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
    handleOrderBy = () => {
        let orderby = this.state.orderBy === 'asc' ? 'desc' : 'asc'
        this.setState({ orderBy: orderby })
        this.setState({ order: orderby === 'desc' ? 1 : -1 })

    }
    handleSortitem = (a, b, condition, typeorder) => {
        console.log(condition+' '+typeorder)
        if (condition === 'point') {
        
            return typeorder === 'asc' ? (a.point > b.point) - (a.point < b.point) : (a.point < b.point) - (a.point > b.point)
        }
        else {
            return typeorder === 'asc' ? (a.alluser_uid > b.alluser_uid) - (a.alluser_uid < b.alluser_uid)
                : (a.alluser_uid < b.alluser_uid) - (a.alluser_uid > b.alluser_uid)
        }

    }
    render() {
        return (
            <Container maxWidth="lg">
                <SlideBar prop={this.props} openSlide={true} appBarName={'All ' + this.props.location.state.pdfname + ' Lecture Notes'} />
                <Grid item lg={12} style={{ textAlign: 'right' }}>
                    <TextField
                        autoFocus
                        size={'small'}
                        margin="normal"
                        label="Filter by Author"
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
                <TableContainer component={Paper} style={{ borderRadius: '10px', background: 'white' }}>

                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={this.state.typeOrder === "author" ? true : false}
                                        direction={this.state.orderBy}
                                        onClick={() => {
                                            this.handleOrderBy()
                                            this.setState({ typeOrder: "author" })
                                        }}>
                                        <b>Author</b>
                                    </TableSortLabel></TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={this.state.typeOrder === "point" ? true : false}
                                        direction={this.state.orderBy}
                                        onClick={() => {
                                            this.handleOrderBy()
                                            this.setState({ typeOrder: "point" })
                                        }}
                                    ><b>Total View(Sec)</b></TableSortLabel></TableCell>
                                <TableCell align='center'><b>Lecture Notes</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(this.state.rowperpage > 0 ?
                                this.state.loadlecturestudent.filter(data => data.alluser_uid.toLowerCase().includes(this.state.filter))
                                    .sort((a, b) => {
                                        return this.handleSortitem(a, b, this.state.typeOrder, this.state.orderBy)
                                    }).slice(this.state.page * this.state.rowperpage,
                                        this.state.page * this.state.rowperpage + this.state.rowperpage)
                                : this.state.loadlecturestudent
                            ).map((value, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {value.alluser_uid.split("it")}
                                    </TableCell>
                                    <TableCell>
                                        {value.point}
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Button className="Button-table"
                                            onClick={() => {
                                                this.props.history.push({
                                                    pathname: `/student-lecture/${value.alluser_uid}/${value.teacherpdf_tpid}`,
                                                    state: { pdfpath: value.spdfname, userid: value.alluser_uid, pdfid: value.sid, pdfname: value.pdfname }
                                                })
                                            }}
                                        >
                                            <VisibilityOutlinedIcon color="action" />
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

