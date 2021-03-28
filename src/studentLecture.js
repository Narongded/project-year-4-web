import * as React from 'react';
import WebViewer from '@pdftron/webviewer'
import {
    Button, Grid, Container, TextField, Fab,
    Popper, MenuList, MenuItem, Paper, Grow, ClickAwayListener, ListItemIcon
} from '@material-ui/core';
import Slidebar from './components/slideBar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import { Rnd } from "react-rnd";
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import ReactPlayer from 'react-player'
import './studentLecture.css'
import { saveAs } from 'file-saver';
import Question from './question.js'
class Studentlecture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            statusopen: false,
            open: false,
            openfile: false,
            openfiletype: "",
            typeFile: null,
            dialogquestionopen: false,
            dialogQA: false,
            dialogUpload: false,
            loadquestion: [],
            filter: '',
            base64: '',
            file: null,
            filename: null,
            filevideo: null,
            play: false,
            fileaudio: null,
            check: null,
            pagevalue: 1,
            question: '',
            popupvideo: false,
            popupaudio: false,
            pageCount: 0,
            time: 0
        }
        this.viewerRef = React.createRef();
        this.popupvideoref = React.createRef();
        this.popupaudioref = React.createRef();
    }

    loadfile = async () => {
        const apiBaseUrl = `http://localhost:3001/user/getdatafile-pdf/${this.props.location.state.pdfid}`;
        await fetch(apiBaseUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }

        }).then((res) => res.json())
            .then((res) => {
                if (res.data[0].file !== null) {
                    if (res.data[0].file.replaceAll("[", "").replaceAll("]", "").split("|")[0].split(",")[1] === "Video") {
                        this.setState({
                            filevideo: "http://localhost:3001/static/file/" +
                                res.data[0].file.replaceAll("[", "").replaceAll("]", "").split("|")[0].split(",")[0]
                        })
                        if (res.data[0].file.replaceAll("[", "").replaceAll("]", "").split("|")[1].split(",")[1] === "Audio") {
                            this.setState({
                                fileaudio: "http://localhost:3001/static/file/" +
                                    res.data[0].file.replaceAll("[", "").replaceAll("]", "").split("|")[1].split(",")[0]
                            })
                        }
                    }
                    else if (res.data[0].file.replaceAll("[", "").replaceAll("]", "").split("|")[0].split(",")[1] === "Audio") {
                        this.setState({
                            fileaudio: "http://localhost:3001/static/file/" +
                                res.data[0].file.replaceAll("[", "").replaceAll("]", "").split("|")[0].split(",")[0]
                        })
                        if (res.data[0].file.replaceAll("[", "").replaceAll("]", "").split("|")[1].split(",")[1] === "Video") {
                            this.setState({
                                filevideo: "http://localhost:3001/static/file/" +
                                    res.data[0].file.replaceAll("[", "").replaceAll("]", "").split("|")[1].split(",")[0]
                            })
                        }
                    }
                }

            })
            .catch((error) => {
                console.error(error);
            });
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
                img: 'assets/icons/baseline_upload_black_48dp.png',
                title: "Upload Lecture Note",
                onClick: async () => this.setState({ dialogUpload: true }),
                hidden: ['small-mobile']
            })
            header.getHeader('small-mobile-more-buttons').unshift({
                type: 'actionButton',
                img: 'assets/icons/baseline_upload_black_48dp.png',
                title: "Upload Lecture Note",
                onClick: async () => this.setState({ dialogUpload: true }),
                dataElement: 'saveButton'
            })
        })
        instance.setHeaderItems(header => {
            header.push({
                type: 'actionButton',
                img: 'assets/icons/outline_ondemand_video_black_48dp.png',
                title: "Upload Video",
                onClick: async () => this.setState({ open: true, typeFile: "Video" }),
                hidden: ['small-mobile']
            })
            header.getHeader('small-mobile-more-buttons').unshift({
                type: 'actionButton',
                img: 'assets/icons/outline_ondemand_video_black_48dp.png',
                title: "Upload Video",
                onClick: async () => this.setState({ open: true, typeFile: "Video" }),
                dataElement: 'saveVideo'
            })
        })
        instance.setHeaderItems(header => {
            header.push({
                type: 'actionButton',
                img: 'assets/icons/outline_record_voice_over_black_48dp.png',
                title: "Upload Audio",
                onClick: async () => this.setState({ open: true, typeFile: "Audio" }),
                hidden: ['small-mobile']
            })
            header.getHeader('small-mobile-more-buttons').unshift({
                type: 'actionButton',
                img: 'assets/icons/outline_record_voice_over_black_48dp.png',
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
    handleOpen = (type) => {
        if (type === 'QA') {
            this.setState({
                dialogQA: true
            })
        } else {
            this.setState({
                statusopen: true
            })
        }
    }

    handleClose = (event, type) => {
        if (type === "video" && this.popupvideoref.current && this.popupvideoref.current.contains(event.target)) {
            return;
        }
        else if (type === "audio" && this.popupaudioref.current && this.popupaudioref.current.contains(event.target)) {
            return;
        }
        if (type === "video") this.setState({ popupvideo: false })
        else if (type === "audio") this.setState({ popupaudio: false })
    };
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
                this.loadfile()
            })
            .catch((error) => {
                console.error(error)
            });
    }
    uploadPdf = async () => {
        const apiBaseUrl = "http://localhost:3001/user/upload-studentpdf"
        const formData = new FormData()
        formData.append('file', this.state.file);
        formData.append('userid', localStorage.getItem('email'))
        formData.append('teacherpdf_tpid', this.props.match.params.lectureid)
        await fetch(apiBaseUrl, {
            method: 'POST',
            body: formData
        }).then((res) => res.json())
            .then((res) => {
                this.setState({ dialogUpload: false, file: null, filename: null })
                window.location.reload()
            })
            .catch((error) => {
                console.error(error)
            });
    }
    componentDidMount() {
        // setInterval(() => console.log("asd"), 1000)
        this.props.location.state === undefined ? this.props.history.push({ pathname: '/login' }) : this.showpdf()
        this.loadfile()
        this.interval = setInterval(() => {
            const time = this.state.time + 1
            this.setState({ time: time })
        }, 1000)
    }
    componentWillUnmount() {
        clearInterval(this.interval)
        this.handlePoint()
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
                    <DialogTitle id="alert-dialog-title">{"Saved"}</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => this.setState({ statusopen: false })} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.dialogquestionopen} onClose={false} aria-labelledby="form-dialog-title">
                    <div>
                        <DialogTitle id="form-dialog-title">Question to Teacher</DialogTitle>
                        <DialogContent style={{ width: '250px' }}>
                            <TextField
                                size={'small'}
                                margin="normal"
                                style={{ width: '80px' }}
                                value={this.state.pagevalue}
                                floatingLabelText="Page"
                                onChange={(event) => event.target.value < 1 ?
                                    this.setState({ pagevalue: 1 }) : event.target.value >= this.state.pageCount ? this.setState({ pagevalue: this.state.pageCount })
                                        : this.setState({ pagevalue: event.target.value })}
                                type="number"
                                label="Page"
                                variant="outlined"
                            />
                            <TextField
                                autoFocus
                                margin="normal"
                                label="Question"
                                floatingLabelText="Question"
                                onChange={(event) => { this.setState({ question: event.target.value }) }}
                                variant="outlined"
                            />
                        </DialogContent>
                    </div>
                    <DialogActions>
                        <Button onClick={() => this.setState({ dialogquestionopen: false })} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.state.question === '' ? () => this.setState({ dialogquestionopen: false })
                            : () => this.questionTeacher()} color="primary" autoFocus>
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog id={'qa'} open={this.state.dialogQA} maxWidth="lg" fullWidth="true" onClose={() => this.setState({ dialogQA: false })} aria-labelledby="form-dialog-title">
                    <Question prop={this.props} lectureid={this.props.match.params.lectureid} userid={localStorage.getItem('email')} />
                </Dialog>
                <Dialog open={this.state.open} onClose={false} aria-labelledby="form-dialog-title">

                    <div>
                        <DialogTitle id="form-dialog-title">{this.state.typeFile}</DialogTitle>
                        <DialogContent style={{ width: '250px' }}>
                            <input
                                style={{ display: 'none' }}
                                id="contained-button-file"
                                multiple
                                accept={this.state.typeFile !== null ? `${this.state.typeFile.toLowerCase()}/*` : null}
                                type="file"
                                onChange={(event) =>
                                    event.target.files[0] === undefined ?
                                        this.setState({ file: null, filename: null })
                                        :
                                        this.setState({ file: event.target.files[0], filename: event.target.files[0].name })}
                            />
                            <label htmlFor="contained-button-file">
                                <Button variant="contained" color="primary" component="span">
                                    Choose File
                                </Button>
                                {this.state.filename ? " : " + this.state.filename : null}
                            </label>
                        </DialogContent>
                    </div>
                    <DialogActions>
                        <Button onClick={() => this.setState({ open: false, file: null, filename: null })} color="primary">
                            Cancel
                        </Button>

                        <Button onClick={() => this.handleUploadFile()} color="primary" autoFocus>
                            Upload
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.dialogUpload} onClose={false} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Upload Your Lecture Note</DialogTitle>
                    <DialogContent style={{ width: '250px' }}>
                        <input
                            accept="application/pdf"
                            style={{ display: 'none' }}
                            id="contained-button-file"
                            multiple
                            type="file"
                            onChange={(event) =>
                                event.target.files[0] === undefined ?
                                    this.setState({ file: null, fileName: null })
                                    :
                                    this.setState({ file: event.target.files[0], fileName: event.target.files[0].name })}
                        />
                        <label htmlFor="contained-button-file">
                            <Button variant="contained" color="primary" component="span">
                                Choose File
                            </Button>
                            {this.state.fileName ? " : " + this.state.fileName : null}
                        </label>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ dialogUpload: false })} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => this.uploadPdf()} color="primary">
                            Upload
                        </Button>
                    </DialogActions>
                </Dialog>

                <Slidebar prop={this.props} appBarName={this.props.location.state.pdfname} openSlide={true} />
                { this.state.openfile &&

                    <Rnd
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "max-content",
                            border: "solid 20px #ffffff00",
                            background: "rgb(240 240 240 / 0%)",
                        }}
                        default={{
                            x: 0,
                            y: 0,
                            width: 320,
                            height: 300,
                        }}
                    >
                        <ReactPlayer
                            playing={this.state.play}
                            loop={false}
                            style={{ display: "contents" }}
                            onError={(e) => console.log(e)}
                            url={this.state.openfiletype === "Video" ?
                                this.state.filevideo
                                : this.state.fileaudio}
                            controls={true} />
                    </Rnd>

                }
                <div className="toolsGroup">
                    <Fab color="primary" aria-label="add" ref={this.popupvideoref}
                        id={'123'}
                        onClick={() => this.setState({ popupvideo: true })}
                        disabled={this.state.filevideo !== null ? false : true}
                    >
                        <AddIcon />
                    </Fab>
                    <Popper open={this.state.popupvideo} anchorEl={this.popupvideoref.current}
                        placement={'left-start'}
                        role={undefined} transition disablePortal>
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin: 'right',
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={(e) => this.handleClose(e, "video")}>
                                        <MenuList autoFocusItem={true} id="menu-list-grow" >
                                            <MenuItem
                                                onClick={() => this.setState({ play: true, openfile: true, openfiletype: "Video" })}>
                                                <ListItemIcon>
                                                    <PlayArrowOutlinedIcon fontSize="small" />
                                                </ListItemIcon>
                                                เล่นวีดีโอ</MenuItem>
                                            <MenuItem
                                                onClick={() => this.setState({ openfile: false, play: false })}>ปิดวีดีโอ</MenuItem>
                                            <MenuItem >ลบวีดีโอ</MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>

                    <Fab color="primary" aria-label="add" ref={this.popupaudioref}
                        onClick={() => this.setState({ popupaudio: true })}
                        disabled={this.state.fileaudio !== null ? false : true}>
                        <AddIcon />
                    </Fab>
                    <Popper open={this.state.popupaudio} anchorEl={this.popupaudioref.current}
                        placement={'left-start'}
                        role={undefined} transition disablePortal>
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin: 'right',
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={(e) => this.handleClose(e, "audio")}>
                                        <MenuList autoFocusItem={true} id="menu-list-grow" >
                                            <MenuItem
                                                onClick={() => this.setState({ play: true, openfile: true, openfiletype: "Audio" })}>
                                                <ListItemIcon>
                                                    <PlayArrowOutlinedIcon fontSize="small" />
                                                </ListItemIcon>
                                                เล่นคลิปเสียง</MenuItem>
                                            <MenuItem onClick={() => this.setState({ openfile: false, play: false })}>ปิดคลิปเสียง</MenuItem>
                                            <MenuItem >ลบคลิปเสียง</MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                    <Fab color="secondary" aria-label="add"
                        onClick={() => this.handleOpen('QA')}
                    >
                        <AddIcon />
                    </Fab>
                </div>
                <div className="webviewer" ref={this.viewerRef} style={{ height: "85vh" }}></div>
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

