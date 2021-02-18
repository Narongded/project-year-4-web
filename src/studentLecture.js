import * as React from 'react';
import WebViewer from '@pdftron/webviewer'
import { Button, Grid, Container } from '@material-ui/core';
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
            open: false,
            base64: '',
            check: null
        }
        this.viewerRef = React.createRef();
        this.checkAuthen()

    }
    checkAuthen = () => {
        let check = null
        const token = localStorage.getItem('token')

        fetch('http://localhost:3001/checktoken', {
            method: 'GET',
            headers: {
                'Authorization': `${token}`
            }
        }).then((res) => {
            if (!res.ok) {
                this.props.history.push({
                    pathname: '/login',
                    state: { path: this.props.location.pathname }
                })
            }
            else {
                this.setState({ check: true })
                res.json()
            }
        })

    }

    showpdf = () => WebViewer(
        {
            path: '/lib',
            initialDoc: `http://localhost:3001/static/pdf/${this.props.location.state.pdfpath}`,
        },
        this.viewerRef.current,
    ).then((instance) => {
        const { docViewer, annotManager } = instance;
        var FitMode = instance.FitMode;
        instance.setFitMode(FitMode.FitWidth);
        // instance.disableElements(['leftPanel', 'leftPanelButton']);
        instance.setHeaderItems(header => {
            header.push({
                type: 'actionButton',
                img: 'assets/icons/itkmitl.jpg',
                title: "Save to Server",
                onClick: async () => {
                    const doc = docViewer.getDocument();
                    const xfdfString = await annotManager.exportAnnotations();
                    const options = { xfdfString };
                    const data = await doc.getFileData(options);
                    const arr = new Uint8Array(data);
                    const blob = new Blob([arr], { type: 'application/pdf' });
                    const apiBaseUrl = "http://localhost:3001/user/upload-studentpdf";
                    const formData = new FormData();
                    formData.append('file', blob);
                    formData.append('userid', localStorage.getItem('email'));
                    formData.append('teacherpdf_tpid', this.props.match.params.lectureid);
                    this.handleOpen();
                    await fetch(apiBaseUrl, {
                        method: 'POST',
                        body: formData
                    }).then((res) => res.json())
                        .then((res) => {
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
            });
        });
        // you can now call WebViewer APIs here...
    });
    
    handleOpen = () => {
        this.setState({
            open: true
        })
    }

    componentDidMount() {
        this.showpdf()
    }
    render() {
        return (

            <Container maxWidth='lg' style={{ marginTop: '50px' }}>
                <Dialog
                    open={this.state.open}
                    onClose={false}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"บันทึกแล้ว"}</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => this.setState({ open: false })} color="primary">
                            ปิด
                        </Button>
                    </DialogActions>
                </Dialog>
                <Slidebar prop={this.props} appBarName='วิชา' openSlide={true} />
                <Button onClick={() => this.setState({ open: false })} color="primary">
                    คำถามคำตอบ
                </Button>
                <div className="header">React sample</div>
                <div className="webviewer" ref={this.viewerRef} style={{ height: "100vh" }}></div>
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

