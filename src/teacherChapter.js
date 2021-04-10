import * as React from 'react';
import { Redirect } from "react-router-dom";
import Slidebar from './components/slideBar';
import {
    AppBar, IconButton, Toolbar, Button, Grid,
    TextField, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TableFooter, TablePagination, TableContainer, Table, TableBody, TableCell,
    TableHead, TableRow, Paper, InputLabel, Select, MenuItem, FormControl
} from '@material-ui/core';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Container from '@material-ui/core/Container';

class Chapter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            dialogType: '',
            chapterid: '',
            subjectid: '',
            chaptername: '',
            semester: 1,
            year: '',
            loadchapter: [],
            rowperpage: 5,
            page: 0
        }
    }

    createChapter = async () => {
        const apiBaseUrl = "http://localhost:3001/admin/create-chapter";
        const payload = {
            "subjectid": this.state.subjectid,
            "chaptername": this.state.chaptername,
            "semester": this.state.semester,
            "year": this.state.year,
            "uid": localStorage.getItem('uid'),
            "teacher": localStorage.getItem('firstname') + " " + localStorage.getItem('lastname')
        }
        await fetch(apiBaseUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then((res) => res.json())
            .then((res) => {
                this.loadChapter()
            })
            .catch((error) => {
                console.error(error);
            });
    }
    loadChapter = async () => {
        const apiBaseUrl = `http://localhost:3001/admin/getall-chapter/${localStorage.getItem('uid')}`;
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
    updateChapter = async (chapterid) => {
        const apiBaseUrl = `http://localhost:3001/admin/update-chapter/${chapterid}`;
        const payload = {
            "subjectid": this.state.subjectid,
            "chaptername": this.state.chaptername,
            "semester": this.state.semester,
            "year": this.state.year,
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
                this.loadChapter()
            })
            .catch((error) => {
                console.error(error);
            });
    }
    deleteChapter = async (chapterid) => {
        const apiBaseUrl = `http://localhost:3001/admin/delete-chapter/${chapterid}`;
        await fetch(apiBaseUrl, {
            method: 'DELETE'
        }).then((res) => res.json())
            .then((res) => {
                this.loadChapter()
            })
            .catch((error) => {
                console.error(error);
            });
    }
    handleClickOpen = (dialogType, chapterid) => {
        this.setState({
            open: true,
            dialogType: dialogType,
            chapterid: chapterid
        })
    };
    handleClose = (page, chapterid) => {
        this.setState({
            open: false
        })
        console.log(chapterid)
        if (page === 'create') {
            if (this.state.subjectid && this.state.chaptername && this.state.semester && this.state.year !== '') {
                this.createChapter()
            }
        }
        if (page === 'update') {
            if (this.state.subjectid && this.state.chaptername && this.state.semester && this.state.year !== '') {
                this.updateChapter(chapterid)
                this.setState({ subjectid: '', chaptername: '', semester: 1, year: '' })
            }
        }
        if (page === 'delete') {
            this.deleteChapter(chapterid)
        }
    };
    onChange(event) {
        this.setState({ semester: event.target.value });
    }
    componentDidMount() {
        this.loadChapter()
    }

    render() {
        return (
            <Container maxWidth="lg" style={{ display: 'flex', flexDirection: 'column' }}>
                <Slidebar prop={this.props} appBarName='All Subjects' openSlide={true} />
                <Dialog open={this.state.open} onClose={false} aria-labelledby="form-dialog-title">
                    {this.state.dialogType !== 'delete' ?
                        <div>
                            <DialogTitle id="form-dialog-title">Subjects</DialogTitle>
                            <DialogContent style={{ width: '250px' }}>
                                <TextField
                                    id="outlined-full-width"
                                    placeholder="Enter Subjects ID"
                                    label="Subject ID"
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={this.state.subjectid ? this.state.subjectid : null}
                                    onChange={(event) => { this.setState({ subjectid: event.target.value }) }}
                                    variant="outlined"
                                />
                                <TextField
                                    id="outlined-full-width"
                                    placeholder="Enter Subjects Name"
                                    label="Subject Name"
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={this.state.chaptername ? this.state.chaptername : null}
                                    onChange={(event) => { this.setState({ chaptername: event.target.value }) }}
                                    variant="outlined"
                                />
                                <FormControl variant="outlined" style={{ minWidth: 120, marginTop: 10, marginBottom: 10 }}>
                                    <InputLabel id="demo-simple-select-outlined-label">Semester</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={this.state.semester}
                                        onChange={this.onChange.bind(this)}
                                        label="Semester"
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={2}>2</MenuItem>
                                        <MenuItem value={3}>3</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    id="outlined-full-width"
                                    placeholder="Enter Year"
                                    margin="normal"
                                    label="Year"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={this.state.year ? this.state.year : null}
                                    onChange={(event) => { this.setState({ year: event.target.value }) }}
                                    variant="outlined"
                                />
                            </DialogContent>
                        </div>
                        :
                        <DialogTitle id="form-dialog-title">Remove This Subjects</DialogTitle>
                    }
                    <DialogActions>
                        <Button onClick={() => this.setState({ open: false, subjectid: '', chaptername: '', semester: 1, year: '' })} color="primary">
                            Cancel
                            </Button>
                        {this.state.dialogType === 'create' ?
                            <Button onClick={() => this.handleClose('create')} color="primary">
                                Create
                            </Button>
                            : this.state.dialogType === 'update' ?
                                <Button onClick={() => this.handleClose('update', this.state.chapterid)} color="primary">
                                    Change
                            </Button>
                                :
                                <Button onClick={() => this.handleClose('delete', this.state.chapterid)} color="primary" autoFocus>
                                    Remove
                            </Button>
                        }
                    </DialogActions>
                </Dialog>
                <Button variant="outlined" color="primary" style={{ marginBottom: '10px', width: 'max-content', alignSelf: 'flex-end' }} onClick={() => this.handleClickOpen('create')}>
                    Create Subject
                        </Button>
                <TableContainer component={Paper} style={{ borderRadius: '10px', background: 'white' }}>

                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Subjects</b></TableCell>
                                <TableCell align="center"><b>Manage Slide</b></TableCell>
                                <TableCell align="center"><b>Change Subject Details</b></TableCell>
                                <TableCell align="center"><b>Remove</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(this.state.rowperpage > 0 ? this.state.loadchapter.slice(this.state.page * this.state.rowperpage, this.state.page * this.state.rowperpage + this.state.rowperpage)
                                : this.state.loadchapter
                            ).map((value, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {value.subjectid} {value.name} ({value.semester}/{value.year})
                                    </TableCell>
                                    <TableCell align="center">

                                        <Button className="Button-table" onClick={() =>
                                            this.props.history.push({
                                                pathname: `/managepdf/${value.cid}`,
                                                state: { name: value.teacher, chapter: value.subjectid+' '+value.name+' ('+value.semester+'/'+value.year+')' }
                                            })
                                        }>
                                            <InsertDriveFileOutlinedIcon color="action" /> &nbsp;
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                    <Button className="Button-table" onClick={() => { this.handleClickOpen('update', value.cid);
                                        this.setState({ subjectid: value.subjectid, chaptername: value.name, semester: value.semester, year: value.year }) }}>
                                            <EditOutlinedIcon color="action" /> &nbsp;
                                            </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                    <Button className="Button-table" onClick={() => this.handleClickOpen('delete', value.cid)}>
                                            <DeleteOutlinedIcon color="action" /> &nbsp;
                                            </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {this.emptyRows > 0 && (
                                <TableRow style={{ height: 53 * this.emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={4}
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

                <div class="footer" style={{
                    position: "fixed", left: "0", bottom: "0",
                    width: "100%", height: "7%", backgroundColor: "red"
                }}>
                    <p>Footer</p>
                </div>
            </Container >

        )
    }
}

export default Chapter

