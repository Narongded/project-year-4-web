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

class Teacherlecturestudent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loadlecturestudent: [],
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
    componentDidMount() {
        this.loadLectureStudent()

    }
    render() {
        return (
            <Container maxWidth="lg">
                <SlideBar prop={this.props} openSlide={true} appBarName='เอกสารบทเรียน' />
                <TableContainer component={Paper}>
                    <Button variant="contained" color="primary" style={{ marginTop: '50px' }} >
                        อัปโหลดเอกสารบทเรียน
                    </Button>

                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>รายการเอกสารบทเรียน</TableCell>
                                <TableCell>ดูเลคเชอร์</TableCell>
                                <TableCell>ดูคำถาม</TableCell>
                                <TableCell>Link เปิดเอกสารบทเรียน</TableCell>
                                <TableCell align="right">ลบ</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(this.state.rowperpage > 0 ? this.state.loadlecturestudent.slice(this.state.page * this.state.rowperpage, this.state.page * this.state.rowperpage + this.state.rowperpage)
                                : this.state.loadlecturestudent
                            ).map((value, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {value.pdfname}
                                    </TableCell>
                                    <TableCell>
                                        <Button color="primary">
                                            ดูเลคเชอร์
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button color="primary" >
                                            ดูคำถาม
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button color="primary" 
                                            onClick={() => navigator.clipboard.writeText(`http://localhost:3000/student/${value.tpid}`)}
                                        >
                                            คัดลอก
                                            </Button>

                                    </TableCell>
                                    <TableCell align="right">
                                        <Button color="primary" >
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

