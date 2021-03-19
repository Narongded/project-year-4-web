import * as React from 'react';

import SlideBar from './components/slideBar'
import { Redirect } from "react-router-dom";
import {
    AppBar, IconButton, Toolbar, Button, Grid,
    TextField, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TableFooter, TablePagination, TableContainer, Table, TableBody, TableCell,
    TableHead, TableRow, Paper, InputAdornment, TableSortLabel
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Container from '@material-ui/core/Container';
import Autocomplete from '@material-ui/lab/Autocomplete';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
class Question extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            dialogType: null,
            pdfid: '',
            id: '',
            qa: '',
            filter: '',
            loadquestion: [],
            actionType: '',
            rowperpage: 5,
            page: 0,
            orderBy: 'asc',
            order: -1
        }
    }
    loadquestion = async () => {
        const apiBaseUrl = this.props.lectureid
        ? `http://localhost:3001/question/getquestion-pdf/${this.props.lectureid}`
        : `http://localhost:3001/question/getquestion-pdf/${this.props.match.params.pdfid}`
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

    createQa = async () => {
        const apiBaseUrl = `http://localhost:3001/answer/addanswer-pdf`;
        const payload = {
            'answer': this.state.qa,
            'qid': this.state.id,
            'alluser_uid': localStorage.getItem('email')
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

    updateQa = async (id, actionType,) => {
        const apiBaseUrl = actionType === 'answer'
            ? `http://localhost:3001/answer/update-answer/${id}`
            : `http://localhost:3001/question/update-question/${id}`
        const payload = {
            'answername': this.state.qa
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

    deleteQa = async (id, actionType,) => {
        let apiBaseUrl = actionType === 'answer'
            ? `http://localhost:3001/answer/delete-answer/${id}`
            : `http://localhost:3001/question/delete-question/${id}`
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
    handleOpen = (dialogType, id, actionType) => {
        this.setState({
            open: true,
            dialogType: dialogType,
            id: id,
            actionType: actionType
        })
    }
    handleClose = (dialogType, id, actionType) => {

        this.setState({
            open: false
        })
        if (dialogType === 'create') {
            if (this.state.qa !== '') {
                this.createQa()
            }
        } else if (dialogType === 'update') {
            if (this.state.qa !== '') {
                this.updateQa(id, actionType)
            }
        } else if (dialogType === 'delete') {
            this.deleteQa(id, actionType)
        }
    }
    handleOrderBy = () => {
        let orderby = this.state.orderBy === 'asc' ? 'desc' : 'asc'
        this.setState({ orderBy: orderby })
        this.setState({ order: orderby === 'desc' ? 1 : -1 })

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
                                    onChange={(event) => {
                                        this.setState({ qa: event.target.value })
                                    }}
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
                                <Button onClick={() => this.handleClose('update', this.state.id, this.state.actionType)} color="primary">
                                    แก้ไข
                            </Button>
                                :
                                <Button onClick={() => this.handleClose('delete', this.state.id, this.state.actionType)} color="primary" autoFocus>
                                    ตกลง
                            </Button>
                        }
                    </DialogActions>
                </Dialog>

                <TableContainer component={Paper} style={{ marginTop: '100px' }}>
                    <Grid item lg={12} style={{ textAlign: 'right' }}>
                        <TextField
                            autoFocus
                            size={'small'}
                            margin="normal"
                            label="ค้นหารหัสนักศึกษา"
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
                                <TableCell><b>หน้า</b></TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={true}
                                        direction={this.state.orderBy}
                                        onClick={() => this.handleOrderBy()}
                                    >
                                       <b> คำถาม  </b></TableSortLabel>
                                </TableCell>
                                <TableCell><b>คำตอบ</b></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { }
                            {(this.state.rowperpage > 0 ?
                                this.state.loadquestion.filter(data => data.ques_alluser_uid.toLowerCase().includes(this.state.filter))
                                    .sort(() => this.state.order)
                                    .slice(this.state.page * this.state.rowperpage,
                                        this.state.page * this.state.rowperpage + this.state.rowperpage)
                                : this.state.loadquestion
                            ).map((value, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {!this.props.userid
                                        ? <Button color="primary" style={{ paddingLeft: '0px' }} onClick={() => {
                                            this.props.history.push({
                                                pathname: `/student-lecture/${value.ques_alluser_uid}/${value.teacherpdfid}`,
                                                state: { pdfpath: value.studentpdf_sid, userid: value.ques_alluser_uid ,page : value.page}
                                            })
                                        }
                                        }>
                                            {value.page}
                                        </Button>
                                        : <React.Fragment>
                                            {value.page}
                                        </React.Fragment>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {value.questionname}
                                    </TableCell>
                                    <TableCell>
                                        {value.answername}
                                    </TableCell>
                                    <TableCell align="right">
                                        {value.answername === null && (value.townerpdf === localStorage.getItem('email')) ?
                                            <Button color="primary" onClick={() => this.handleOpen('create', value.qid, 'answer')}>
                                                <AddOutlinedIcon color="action" /> &nbsp;
                                                เพิ่มคำตอบ
                                            </Button>
                                            : null
                                        }
                                    </TableCell>
                                    <TableCell align="right">
                                        {(value.answername || value.answername === '') && value.ans_alluser_uid === localStorage.getItem('email') ?
                                            <Button color="primary" onClick={() => this.handleOpen('update', value.aid, 'answer')}>
                                                <EditOutlinedIcon color="action" /> &nbsp;
                                                แก้ไขคำตอบ
                                            </Button>
                                            : value.ques_alluser_uid === localStorage.getItem('email') ?
                                                <Button color="primary" onClick={() => this.handleOpen('update', value.qid, 'question')}>
                                                    <EditOutlinedIcon color="action" /> &nbsp;
                                                    แก้ไขคำถาม
                                                </Button>
                                                : null
                                        }
                                    </TableCell>
                                    <TableCell align="right">
                                        {value.answername && (value.ans_alluser_uid === localStorage.getItem('email')) ?
                                            <Button color="primary" onClick={() => this.handleOpen('delete', value.aid, 'answer')}>
                                                <DeleteOutlinedIcon color="action" /> &nbsp;
                                                ลบคำตอบ
                                            </Button>
                                            : (value.questionname || value.questionname === '') && (value.ques_alluser_uid === localStorage.getItem('email')) ?
                                                <Button color="primary" onClick={() => this.handleOpen('delete', value.qid, 'question')}>
                                                    <DeleteOutlinedIcon color="action" /> &nbsp;
                                                    ลบคำถาม
                                            </Button> : null
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
            </Container >
        )
    }
}

export default Question

