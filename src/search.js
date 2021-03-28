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

class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            loadchapter: [],
            rowperpage: 5,
            page: 0
        }
    }
    handleRedirect = async (page, cid, userid) => {
        if (page === 'searchpdf') this.props.history.push({
            pathname: `/managepdf/${cid}`,
            state: { userid: userid }
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

    componentDidMount() {
        this.loadChapter()
    }

    render() {
        return (
            <Container maxWidth="lg">
                <Slidebar prop={this.props} appBarName='Search Lecture Notes' openSlide={true} />
                <TableContainer component={Paper} style={{ marginTop: '100px' }}>
                    <Table aria-label="simple table" >
                        <TableHead>
                            <TableRow>
                                <TableCell> <b> Subjects </b></TableCell>
                                <TableCell align="center"><b>Lecture Notes</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.loadchapter.map((value, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {value.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button color="primary" onClick={() => this.handleRedirect('searchpdf', value.cid, value.teacher)}>
                                            <InsertDriveFileOutlinedIcon color="action" /> &nbsp;
                                            All Lecture Notes
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

export default Search

