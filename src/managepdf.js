import * as React from 'react';
import './App.css';
import { Redirect } from "react-router-dom";
import { InputLabel, Button, Grid, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

class Managepdf extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            pdfname: '',
            loadPdf: [],
            file: null
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
    handleClickOpen = () => {
        this.setState({
            open: true
        })
    };

    handleClose = () => {
        this.setState({
            open: false
        })

        this.uploadPdf()
    };
    componentDidMount() {
        this.loadPdf()

    }
    render() {
        return (
            <div class="container" >
                <Grid container direction="row" >

                    <Button variant="contained" color="primary" onClick={this.handleClickOpen}>
                        upload chapter
                     </Button>
                </Grid>
                <Dialog open={this.state.open} onClose={false} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">บทเรียน</DialogTitle>
                    <DialogContent style={{ width: '250px' }}>
                        <TextField
                            id="outlined-full-width"
                            style={{ margin: 8 }}
                            placeholder="กรุณากรอกบทเรียน"
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
                            onChange={(event) => this.setState({ file: event.target.files[0] })}
                        />
                        <label htmlFor="contained-button-file">
                            <Button variant="contained" color="primary" component="span">
                                Upload
                            </Button>
                        </label>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => this.setState({ open: false })} color="primary">
                            Cancel
                         </Button>
                        <Button onClick={this.handleClose} color="primary">
                            Create
                         </Button>
                    </DialogActions>
                </Dialog>
                {this.state.loadPdf.map((value, index) => (
                    <div>
                        <p>{value.pdfname}</p>
                        <p>http://localhost:3001/student/{value.pdfid}</p>

                    </div>
                ))}
            </div>
        )
    }
}

export default Managepdf

