import * as React from 'react';
import './App.css';
import WebViewer from '@pdftron/webviewer'

import { Button, Grid } from '@material-ui/core';

class Pdfano extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            base64: '',
            check: null,
            loadpdf: []
        }
        this.viewerRef = React.createRef();
        this.checkAuthen()

    }
    checkAuthen = () => {
        let check = null
        const token = localStorage.getItem('token')
        console.log(token)
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
                this.loadpdf()
                res.json()
            }
        })

    }
   
    loadpdf = async () => {
        const apiBaseUrl = `http://localhost:3001/user/getfile-pdf/${this.props.match.params.pdfid}`;
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

            this.showpdf()
    }

    showpdf = () => WebViewer(
        {
            path: '/lib',
            initialDoc: `http://localhost:3001/static/pdf/${this.state.loadpdf[0].pdfpath}`,
        },
        this.viewerRef.current,
    ).then((instance) => {
        const { docViewer } = instance;
        instance.disableElements([ 'leftPanel', 'leftPanelButton' ]);
        
        // you can now call WebViewer APIs here...
    });

    componentDidMount() {

    }
    render() {
        return (

            <div class="container">

                    <Grid container direction="row" >
                        <Grid item xs={12}>
                            <div className="MyComponent">
                                <div className="header">React sample</div>
                                <div className="webviewer" ref={this.viewerRef} style={{ height: "100vh" }}></div>
                            </div>
                        </Grid>
                        <Grid item xs={4} >
                            <Button onClick={this.handleSelectUrl}>asdas</Button>

                        </Grid>
                    </Grid>
    
            </div>
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
export default Pdfano

