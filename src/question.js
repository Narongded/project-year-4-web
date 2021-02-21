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
            id: '',
            answer: '',
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

    createAnswer = async () => {
        const apiBaseUrl = `http://localhost:3001/answer/addanswer-pdf`;
        const payload = {
            'answer': this.state.answer,
            'qid': this.state.id
        }
        fetch(apiBaseUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then((res) => res.json())
        .then((res) => {
            this.loadquestion()
        })
        .catch((error) => {
            console.error(error);
        });
    }

    updateAnswer = async (aid) => {
        const apiBaseUrl = `http://localhost:3001/answer/update-answer/${aid}`;
        const payload = {
            'answername': this.state.answer
        }
        await fetch(apiBaseUrl, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then((res) => res.json())
            .then((res) => {
                this.loadquestion()
            })
            .catch((error) => {
                console.error(error);
            });
    }

    deleteAnswer = async (aid) => {
        const apiBaseUrl = `http://localhost:3001/answer/delete-answer/${aid}`;
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
    handleOpen = (dialogType, id) => {
        this.setState({
            open: true,
            dialogType: dialogType,
            id: id
        })
    }
    handleClose = (dialogType, id) => {
        this.setState({
            open: false
        })
        if (dialogType === 'create') {
            this.createAnswer()
        } else if (dialogType === 'update') {
            this.updateAnswer(id)
        } else if (dialogType === 'delete') {
            this.deleteAnswer(id)
        }
    }
    componentDidMount() {
        this.loadquestion()

    }
    render() {
        return (
            <Container maxWidth="lg">
                <SlideBar prop={this.props} openSlide={true} appBarName='คำถามจากนักศึกษา' />

                <Dialog open={this.state.open} onClose={false} aria-labelledby="form-dialog-title">
                    {this.state.dialogType !== 'delete' ?
                        <div>
                            <DialogTitle id="form-dialog-title">คำตอบ</DialogTitle>
                            <DialogContent style={{ width: '250px' }}>
                                <TextField
                                    id="outlined-full-width"
                                    style={{ margin: 8 }}
                                    placeholder="กรอกคำตอบ"
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={(event) => { this.setState({ answer: event.target.value }) }}
                                    variant="outlined"
                                />
                            </DialogContent>
                        </div>
                        :
                        <DialogTitle id="form-dialog-title">ต้องการลบคำตอบ</DialogTitle>
                    }
                    <DialogActions>
                        <Button onClick={() => this.setState({ open: false })} color="primary">
                            ยกเลิก
                            </Button>
                        {this.state.dialogType === 'create' ?
                            <Button onClick={() => this.handleClose('create')} color="primary">
                                สร้าง
                            </Button>
                            : this.state.dialogType === 'update' ?
                                <Button onClick={() => this.handleClose('update', this.state.id)} color="primary">
                                    แก้ไข
                            </Button>
                                :
                                <Button onClick={() => this.handleClose('delete', this.state.id)} color="primary" autoFocus>
                                    ตกลง
                            </Button>
                        }
                    </DialogActions>
                </Dialog>

                <TableContainer component={Paper}>
                    <Button variant="contained" color="primary" style={{ marginTop: '50px' }} >
                        เพิ่มคำถาม
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
                                        {value.answername}
                                    </TableCell>                                   
                                    <TableCell align="right">
                                        { value.answername === null ? 
                                            <Button color="primary" onClick={() => this.handleOpen('create', value.qid)}>
                                                เพิ่มคำตอบ
                                            </Button>
                                        : null
                                        }
                                    </TableCell>
                                    <TableCell align="right">
                                        {value.answername || value.answername === '' ?
                                            <Button color="primary" onClick={() => this.handleOpen('update', value.aid)}> 
                                                แก้ไขคำตอบ
                                            </Button>
                                        : null
                                        }
                                    </TableCell>
                                    <TableCell align="right">
                                        {value.answername ?
                                            <Button color="primary" onClick={() => this.handleOpen('delete', value.aid)}> 
                                                ลบ
                                            </Button>
                                        : null
                                        }
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

