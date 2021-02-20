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

class Question extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            dialogType: null,
            pdfid: '',
            pdfname: '',
            loadquestion: [],
            file: null,
            fileName: null,
            rowperpage: 5,
            page: 0
        }
    }
    loadquestion = async () => {
        const apiBaseUrl = `http://localhost:3001/question/getquestion-pdf/${this.props.match.params.pdfid}`;
        await fetch(apiBaseUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }

        }).then((res) => res.json())
            .then((res) => {
                this.setState({ loadquestion: res.data })
            })
            .catch((error) => {
                console.error(error);
            });
    }

    deleteAnswer = async (pdfid) => {
        const apiBaseUrl = `http://localhost:3001/user/delete-pdf/${pdfid}`;
        await fetch(apiBaseUrl, {
            method: 'DELETE'
        }).then((res) => res.json())
            .then((res) => {
                this.loadquestion()
            })
            .catch((error) => {
                console.error(error);
            });
    }
    handleOpen = () => {
        this.setState({
            open: true
        })
    }
    createAnswer = () => {
        this.setState({
            open: false
        })
    }
    componentDidMount() {
        this.loadquestion()

    }
    render() {
        return (
            <Container maxWidth="lg">
                <SlideBar prop={this.props} openSlide={true} appBarName='คำถามจากนักศึกษา' />

                <Dialog open={this.state.open} onClose={false} aria-labelledby="form-dialog-title">
                    <div>
                        <DialogTitle id="form-dialog-title">คำตอบ</DialogTitle>
                        <DialogContent style={{ width: '250px' }}>
                            <TextField
                                autoFocus
                                margin="normal"
                                label="คำตอบ"
                                floatingLabelText="คำตอบ"
                                onChange={(event) => { this.setState({ question: event.target.value }) }}
                                variant="outlined"
                            />
                        </DialogContent>
                    </div>
                    <DialogActions>
                        <Button onClick={() => this.setState({ open: false })} color="primary">
                            ยกเลิก
                        </Button>
                        <Button onClick={() => this.createAnswer()} color="primary" autoFocus>
                            ตกลง
                        </Button>
                    </DialogActions>
                </Dialog>

                <TableContainer component={Paper}>
                    <Button variant="contained" color="primary" style={{ marginTop: '50px' }} >
                        คำถามจากนักศึกษา
                    </Button>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>คำถาม</TableCell>
                                <TableCell>คำตอบ</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell align="right">ลบ</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(this.state.rowperpage > 0 ? this.state.loadquestion.slice(this.state.page * this.state.rowperpage, this.state.page * this.state.rowperpage + this.state.rowperpage)
                                : this.state.loadquestion
                            ).map((value, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {value.name}
                                    </TableCell>
                                    <TableCell>
                                        คำตอบ 1
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button color="primary" onClick={() => this.handleOpen()}>เพิ่มคำตอบ</Button>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button color="primary" onClick={() => this.handleOpen()}>แก้ไขคำตอบ</Button>
                                    </TableCell>
                                    <TableCell align="right">
                                        {/* ลบคำคอตบ */}
                                        <Button color="primary" onClick={() => this.handleOpen('delete', value.aid)}> 
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
                                    count={this.state.loadquestion.length}
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

export default Question

