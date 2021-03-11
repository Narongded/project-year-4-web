import * as React from 'react';
import WebViewer from '@pdftron/webviewer'
import { Button, Grid, Container, TextField } from '@material-ui/core';
import Slidebar from './components/slideBar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { saveAs } from 'file-saver';
class Studentlecture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            statusopen:false,
            open: false,
            typeFile: null,
            dialogquestionopen: false,
            base64: '',
            file: null,
            filename: null,
            check: null,
            pagevalue: 1,
            question: '',
            pageCount: 0
        }
        this.viewerRef = React.createRef();
    }
    questionTeacher = async () => {
        this.setState({ dialogquestionopen: false })
        const apiBaseUrl = `http://localhost:3001/question/addquestion-pdf`;
        const pdfid = this.props.match.params.lectureid
        const payload = {
            'page': this.state.pagevalue,
            'question': this.state.question,
            'uid': localStorage.getItem('email'),
            'pdfid': pdfid,
            'studentpdfpath': this.props.location.state.pdfpath
        }
        fetch(apiBaseUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then((res) => res.json()).then((res) => console.log('a'))
    }

    showpdf = () => WebViewer(
        {
            path: '/lib',
            initialDoc: `http://localhost:3001/static/pdf/${this.props.location.state.pdfpath}`,
        },
        this.viewerRef.current,
    ).then((instance) => {
        const { docViewer, annotManager } = instance
        const savedata = async (header) => {
            const doc = docViewer.getDocument()
            const xfdfString = await annotManager.exportAnnotations({})
            const options = { xfdfString }
            const data = await doc.getFileData(options)
            const arr = new Uint8Array(data)
            const blob = new Blob([arr], { type: 'application/pdf' })
            const apiBaseUrl = "http://localhost:3001/user/upload-studentpdf"
            const formData = new FormData()
            formData.append('file', blob);
            formData.append('userid', localStorage.getItem('email'))
            formData.append('teacherpdf_tpid', this.props.match.params.lectureid)
            this.handleOpen()
            await fetch(apiBaseUrl, {
                method: 'POST',
                body: formData
            }).then((res) => res.json())
                .then((res) => {
                })
                .catch((error) => {
                    console.error(error)
                });
        }

        instance.disableElements(['annotationNoteConnectorLine'])
        const FitMode = instance.FitMode
        instance.setFitMode(FitMode.FitWidth)
        instance.disableFeatures(instance.Feature.TextSelection)
        instance.disableFeatures(instance.Feature.NotesPanel)
        instance.disableElements([
            'stickyToolButton', 'annotationCommentButton',
            'underlineToolGroupButton', 'highlightToolGroupButton',
            'strikeoutToolGroupButton', 'squigglyToolGroupButton',
            'stickyToolGroupButton', 'outlinesPanelButton',
            'toggleNotesButton', 'highlightToolButton'])
        instance.setHeaderItems(header => {
            header.push({
                type: 'actionButton',
                img: 'assets/icons/outline_save_black_48dp.png',
                title: "Save to Server",
                onClick: async () => savedata(header),
                hidden: ['small-mobile']
            })
            header.getHeader('small-mobile-more-buttons').unshift({
                type: 'actionButton',
                img: 'assets/icons/outline_save_black_48dp.png',
                title: "Save to Server",
                onClick: async () => savedata(header),
                dataElement: 'saveButton'
            })
        })
        instance.setHeaderItems(header => {
            header.push({
                type: 'actionButton',
                img: 'assets/icons/outline_save_black_48dp.png',
                title: "Upload Video",
                onClick: async () => this.setState({ open: true, typeFile: "Video" }),
                hidden: ['small-mobile']
            })
            header.getHeader('small-mobile-more-buttons').unshift({
                type: 'actionButton',
                img: 'assets/icons/outline_save_black_48dp.png',
                title: "Upload Video",
                onClick: async () => this.setState({ open: true, typeFile: "Video" }),
                dataElement: 'saveVideo'
            })
        })
        instance.setHeaderItems(header => {
            header.push({
                type: 'actionButton',
                img: 'assets/icons/outline_save_black_48dp.png',
                title: "Upload Audio",
                onClick: async () => this.setState({ open: true, typeFile: "Audio" }),
                hidden: ['small-mobile']
            })
            header.getHeader('small-mobile-more-buttons').unshift({
                type: 'actionButton',
                img: 'assets/icons/outline_save_black_48dp.png',
                title: "Upload Audio",
                onClick: async () => this.setState({ open: true, typeFile: "Audio" }),
                dataElement: 'saveAudio'
            })
        })
        docViewer.on('documentLoaded', () => {
            this.setState({ pageCount: docViewer.getPageCount() })
            if (this.props.location.state.page) docViewer.setCurrentPage(this.props.location.state.page)
        })
        docViewer.on('pageNumberUpdated', () => {
            this.setState({ pageCount: docViewer.getPageCount() })
        })

        instance.setHeaderItems(header => {
            header.push({
                type: 'actionButton',
                img: 'assets/icons/outline_question_answer_black_48dp.png',
                title: "Question teacher",
                onClick: async () => this.setState({ dialogquestionopen: true, pagevalue: docViewer.getCurrentPage() }),
                hidden: ['small-mobile']
            })
            header.getHeader('small-mobile-more-buttons').unshift({
                type: 'actionButton',
                img: 'assets/icons/outline_question_answer_black_48dp.png',
                title: "Question teacher",
                onClick: async () => this.setState({ dialogquestionopen: true, pagevalue: docViewer.getCurrentPage() }),
                dataElement: 'Question'
            })
        })

        instance.setHeaderItems(header => {
            header.push({
                type: 'actionButton',
                img: 'assets/icons/outline_add_box_black_48dp.png',
                title: "New Page",
                onClick: async () => {
                    const doc = docViewer.getDocument()
                    const width = 612;
                    const height = 792
                    await doc.insertBlankPages([docViewer.getCurrentPage() + 1], width, height)
                    this.setState({ pageCount: docViewer.getPageCount() })
                }, dataElement: 'newButton',
                hidden: ['small-mobile']
            })
            header.getHeader('small-mobile-more-buttons').unshift({
                type: 'actionButton',
                img: 'assets/icons/outline_add_box_black_48dp.png',
                title: "New Page",
                onClick: async () => {
                    const doc = docViewer.getDocument()
                    const width = 612;
                    const height = 792
                    await doc.insertBlankPages([docViewer.getCurrentPage() + 1], width, height)
                    this.setState({ pageCount: docViewer.getPageCount() })
                }, dataElement: 'newButton'
            })
        })
    })
    handleOpen = () => {
        this.setState({
            statusopen: true
        })
    }
    handleUploadFile = async () => {
        const apiBaseUrl = "http://localhost:3001/user/upload-file/" + this.props.location.state.pdfid
        const formData = new FormData()
        formData.append('file', this.state.file);
        formData.append('type', this.state.typeFile)
        this.handleOpen()
        await fetch(apiBaseUrl, {
            method: 'POST',
            body: formData
        }).then((res) => res.json())
            .then((res) => {
                this.setState({ open: false, file: null, filename: null })
            })
            .catch((error) => {
                console.error(error)
            });
    }
    componentDidMount() {
        this.props.location.state === undefined ? this.props.history.push({ pathname: '/login' }) : this.showpdf()
    }
    render() {
        return (

            <Container maxWidth='lg' style={{ marginTop: '50px' }}>
                <Dialog
                    open={this.state.statusopen}
                    onClose={false}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"บันทึกแล้ว"}</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => this.setState({ statusopen: false })} color="primary">
                            ปิด
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.dialogquestionopen} onClose={false} aria-labelledby="form-dialog-title">
                    <div>
                        <DialogTitle id="form-dialog-title">ชื่อบทเรียน</DialogTitle>
                        <DialogContent style={{ width: '250px' }}>
                            <TextField
                                size={'small'}
                                margin="normal"
                                style={{ width: '80px' }}
                                value={this.state.pagevalue}
                                floatingLabelText="หน้า"
                                onChange={(event) => event.target.value < 1 ?
                                    this.setState({ pagevalue: 1 }) : event.target.value >= this.state.pageCount ? this.setState({ pagevalue: this.state.pageCount}) 
                                    : this.setState({ pagevalue: event.target.value })}
                                type="number"
                                label="หน้า"
                                variant="outlined"
                            />
                            <TextField
                                autoFocus
                                margin="normal"
                                label="คำถาม"
                                floatingLabelText="คำถาม"
                                onChange={(event) => { this.setState({ question: event.target.value }) }}
                                variant="outlined"
                            />
                        </DialogContent>
                    </div>
                    <DialogActions>
                        <Button onClick={() => this.setState({ dialogquestionopen: false })} color="primary">
                            ยกเลิก
                        </Button>
                        <Button onClick={this.state.question === '' ? () => this.setState({ dialogquestionopen: false }) 
                        : () => this.questionTeacher()} color="primary" autoFocus>
                            ตกลง
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.open} onClose={false} aria-labelledby="form-dialog-title">

                    <div>
                        <DialogTitle id="form-dialog-title">{this.state.typeFile}</DialogTitle>
                        <DialogContent style={{ width: '250px' }}>
                            <input
                                style={{ display: 'none' }}
                                id="contained-button-file"
                                multiple
                                type="file"
                                onChange={(event) =>
                                    event.target.files[0] === undefined ?
                                        this.setState({ file: null, filename: null })
                                        :
                                        this.setState({ file: event.target.files[0], filename: event.target.files[0].name })}
                            />
                            <label htmlFor="contained-button-file">
                                <Button variant="contained" color="primary" component="span">
                                    เลือกไฟล์
                                </Button>
                                {this.state.filename ? " : " + this.state.filename : null}
                            </label>
                        </DialogContent>
                    </div>
                    <DialogActions>
                        <Button onClick={() => this.setState({ open: false, file: null, filename: null })} color="primary">
                            ยกเลิก
                        </Button>

                        <Button onClick={() => this.handleUploadFile()} color="primary" autoFocus>
                            ตกลง
                        </Button>
                    </DialogActions>
                </Dialog>

                <Slidebar prop={this.props} appBarName='วิชา' openSlide={true} />
                <div className="webviewer" ref={this.viewerRef} style={{ height: "88vh" }}></div>
            </Container >
        )
    }
}

// encodeBase64 = (file) => new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(this.setState({ base64: reader.result }));
//     reader.onerror = error => reject(error);
//     console.log(this.state.base64)
// });
// handleSelectUrl = (pdfpath) => {

//     // tslint:disable-next-line:one-variable-per-declaration
//     fetch(`http://localhost:3000/static/pdf/${pdfpath}`)
//         .then(res => res.blob()) // Gets the response and returns it as a blob
//         .then(blob => {
//             const metadata = {
//                 type: 'application/pdf'
//             };
//             const file = new File([blob], 'test.jpg', metadata);
//             this.encodeBase64(file)

//         });

// }
export default Studentlecture

