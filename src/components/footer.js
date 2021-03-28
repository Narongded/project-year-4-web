import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

class Footer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        return (
            <AppBar position="static" color="primary" style={{ position: "fixed", bottom: 0, textAlign: "center", paddingBottom: 5}}>
                <Container maxWidth="xl">
                    <Toolbar>
                        <Typography variant="body1" color="inherit">
                            © 2021 Lecture Note Taking System
                        </Typography>
                    </Toolbar>
                </Container>
            </AppBar>
        )
    }
}

export default Footer