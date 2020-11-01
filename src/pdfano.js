import * as React from 'react';
import './App.css';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, Annotation, TextSearch, Inject } from '@syncfusion/ej2-react-pdfviewer';
import { Button, RestoreIcon, Card, CardContent, Grid, MenuItem, Select, TextField, Typography, BottomNavigation, BottomNavigationAction } from '@material-ui/core';

class Pdfano extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            test: '',
            base64: ''

        }
    }
    handleSelectUrl = () => {

        // tslint:disable-next-line:one-variable-per-declaration
        fetch('https://e-meeting.kmitl.ac.th/api/static/pdf/5nvqc4c0gtr.pdf')
            .then(res => res.blob()) // Gets the response and returns it as a blob
            .then(blob => {
                const metadata = {
                    type: 'image/jpeg'
                };
                const file = new File([blob], 'test.jpg', metadata);
                this.encodeBase64(file)

            });

    }

    encodeBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(this.setState({ base64: reader.result }));
        reader.onerror = error => reject(error);
        console.log(this.state.base64)
    });
    componentDidMount() {

    }
    render() {
        return (
            <div
                class="container">
                <Grid container direction="row" >
                    <Grid item xs={8}>
                        <PdfViewerComponent id="container"
                            documentPath={this.state.base64}
                            enableCommentPanel={false}
                            serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/pdfviewer" style={{ 'height': '640px' }}>
                            <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch]} />
                        </PdfViewerComponent>
                    </Grid>
                    <Grid item xs={4} >
                        <Button onClick={this.handleSelectUrl}>asdas</Button>

                    </Grid>
                </Grid>

            </div>
        )
    }
}

export default Pdfano

