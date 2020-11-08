import * as React from 'react';
import './App.css';
import { Redirect } from "react-router-dom";

import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, Annotation, TextSearch, Inject } from '@syncfusion/ej2-react-pdfviewer';
import { Button, Grid } from '@material-ui/core';

class Pdfano extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            base64: '',
            check: null,
            loadpdf: []
        }
        this.checkAuthen()

    }
    checkAuthen = () => {
        let check = null
        const token = localStorage.getItem('token')
        console.log(token)
        fetch('http://localhost:3000/checktoken', {
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
                this.loadpdf()
                res.json()
            }
        })
        //.then((res) => {
        //         console.log(res.status)
        //         if (res.status === 'Success') {
        //         }
        //         else {
        //             this.props.history.push({
        //                 pathname: '/template',
        //                 search: '?query=abc',
        //                 state: { path: this.props.location.pathname }
        //             })
        //         }
        //     })

    }
    handleSelectUrl = (pdfpath) => {

        // tslint:disable-next-line:one-variable-per-declaration
        fetch(`http://localhost:3000/static/pdf/${pdfpath}`)
            .then(res => res.blob()) // Gets the response and returns it as a blob
            .then(blob => {
                const metadata = {
                    type: 'application/pdf'
                };
                const file = new File([blob], 'test.jpg', metadata);
                this.encodeBase64(file)

            });

    }
    loadpdf = async () => {
        const apiBaseUrl = `http://localhost:3000/user/getfile-pdf/${this.props.match.params.pdfid}`;
        await fetch(apiBaseUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }

        }).then((res) => res.json())
            .then((res) => {
                this.setState({ loadpdf: res.data })
            })
            .catch((error) => {
                console.error(error);
            });

        this.handleSelectUrl(this.state.loadpdf[0].pdfpath)

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

                { this.state.check === true ?
                    <Grid container direction="row" >
                        <Grid item xs={8}>
                            <PdfViewerComponent id="container"
                                enableToolbar={true}
                                documentPath={this.state.base64}
                                serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/pdfviewer" style={{ 'height': '640px' }}>
                                <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch]} />
                            </PdfViewerComponent>
                        </Grid>
                        <Grid item xs={4} >
                            <Button onClick={this.handleSelectUrl}>asdas</Button>

                        </Grid>
                    </Grid>
                    : null}
            </div>
        )
    }
}

export default Pdfano

