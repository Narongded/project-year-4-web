import * as React from 'react';

import SlideBar from './components/slideBar'
import { Redirect } from "react-router-dom";
import { 
    InputLabel, Button, Grid, TextField, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, TableContainer, Paper, Table, TableHead, TableBody, TableRow, TableCell
} from '@material-ui/core';
import Container from '@material-ui/core/Container';

class Managepdf extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            dialogType: null,
            pdfid: '',
            pdfname: '',
            loadPdf: [],
            file: null,
            fileName: null
        }
    }
    uploadPdf = async () => {
        const apiBaseUrl = "http://localhost:3001/admin/upload-pdf";
        const payload = {
            "chaptername": this.state.chaptername,

        }

        const formData = new FormData();
        formData.append('pdfname', this.state.pdfname);
        formData.append('file', this.state.file);
        formData.append('role', localStorage.getItem('role'));
        formData.append('chapterid', this.props.match.params.chapterid);
        // ...
        await fetch(apiBaseUrl, {
            method: 'POST',
            body: formData
        }).then((res) => res.json())
            .then((res) => {
                this.loadPdf()
            })
            .catch((error) => {
                console.error(error);
            });
    }

    loadPdf = async () => {
        const apiBaseUrl = `http://localhost:3001/admin/getfile-pdf/${this.props.match.params.chapterid}`;
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

    deletePdf = async (pdfid) => {
        const apiBaseUrl = `http://localhost:3001/admin/delete-pdf/${pdfid}`;
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

    handleClickOpen = (dialogType, pdfid) => {
        this.setState({
            open: true,
            dialogType: dialogType,
            pdfid: pdfid
        })
    };

    handleClose = (page, pdfid) => {
        this.setState({
            open: false
        })
        console.log(pdfid)
        if (page === 'create') {
            this.uploadPdf()
        }
        if (page === 'delete') {
            this.deletePdf(pdfid)
        }
        this.setState({ fileName: null })
    };

    componentDidMount() {
        this.loadPdf()

    }
    render() {
        return (
            <Container maxWidth="lg">
                <SlideBar props={this.props} openSlide={true} appBarName='เอกสารบทเรียน' />
                <Dialog open={this.state.open} onClose={false} aria-labelledby="form-dialog-title">
                    {this.state.dialogType !== 'delete' ?
                    <div>
                        <DialogTitle id="form-dialog-title">ชื่อบทเรียน</DialogTitle>
                        <DialogContent style={{ width: '250px' }}>
                            <TextField
                                id="outlined-full-width"
                                style={{ margin: 8 }}
                                placeholder="กรุณากรอกชื่อบทเรียน"
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(event) => { this.setState({ pdfname: event.target.value }) }}
                                variant="outlined"
                            />
                        </DialogContent>
                        <DialogContent style={{ width: '250px' }}>
                            <input
                                accept="application/pdf"
                                style={{ display: 'none' }}
                                id="contained-button-file"
                                multiple
                                type="file"
                                onChange={(event) => this.setState({ file: event.target.files[0], fileName: event.target.files[0].name })}
                            />
                            <label htmlFor="contained-button-file">
                                <Button variant="contained" color="primary" component="span">
                                    เลือกเอกสาร
                                </Button>
                                {this.state.fileName ? " : "+this.state.fileName : null}
                            </label>
                        </DialogContent>
                    </div>
                    :
                    <DialogTitle id="form-dialog-title">ต้องการลบเอกสารบทเรียน</DialogTitle>
                    }
                    <DialogActions>
                        <Button onClick={() => this.setState({ open: false })} color="primary">
                            ยกเลิก
                        </Button>
                        {this.state.dialogType === 'create' ?
                        <Button onClick={() => this.handleClose('create')} color="primary">
                            อัปโหลด
                        </Button>
                        :
                        <Button onClick={() => this.handleClose('delete', this.state.pdfid)} color="primary" autoFocus>
                            ตกลง
                        </Button>
                        }
                        
                    </DialogActions>
                </Dialog>

                <TableContainer component={Paper}>
                    <Button variant="contained" color="primary" style={{ marginTop: '5vw' }} onClick={() => this.handleClickOpen('create')}>
                        อัปโหลดเอกสารบทเรียน
                    </Button>
                    <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>รายการเอกสารบทเรียน</TableCell>
                                    <TableCell>Link เปิดเอกสารบทเรียน</TableCell>
                                    <TableCell align="right">ลบ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.loadPdf.map((value, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            {value.pdfname}
                                        </TableCell>
                                        <TableCell>
                                            http://localhost:3001/student/{value.pdfid}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button color="primary" onClick={() => this.handleClickOpen('delete', value.pdfid)}>
                                                ลบ
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

export default Managepdf

