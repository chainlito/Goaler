import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
// import CardMedia from '@material-ui/core/CardMedia';
// import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
// import Grid from '@material-ui/core/Grid';
// import LogoIcon from '@material-ui/icons/Beenhere';
import Button from '@material-ui/core/Button';
// import darts from './darts.jpeg';

import './login.css';

class Login extends Component {
    render() {
        return (
            <React.Fragment>

            <Card className="login-titleCard">
                {/* <CardMedia
                    className="login-titleCard_img"
                    component="img"
                    alt="Inspirational Goal Image"
                    image={darts}/> */}
                <div className="login-titleCard_container">
                    <Typography variant="h2" className="login-titleCard_title" gutterBottom>
                        Welcome to <strong>GOALER</strong>
                    </Typography>
                    <Typography variant="h5" align="right" className="login-titleCard_subtitle" gutterBottom>
                        Track your goals.
                    </Typography>
                    <Typography variant="h5" align="right" className="login-titleCard_subtitle" gutterBottom>
                        Get more things done.
                    </Typography>
                    {
                        this.props.user
                        ? <React.Fragment>
                            <Typography variant="h5" align="right" className="login-titleCard_actionCall" gutterBottom>
                                Welcome, {this.props.user.displayName}
                            </Typography>
                            <Button variant="contained" color="secondary" className="login-titleCard_dashBtn" onClick={() => this.props.history.push('/')}>
                                See your Goals
                            </Button>
                        </React.Fragment>
                        : <Typography variant="h5" align="right" className="login-titleCard_actionCall" gutterBottom>
                            <Button variant="contained" color="secondary" onClick={this.props.login}>Sign in</Button>
                            &nbsp;with Google
                        </Typography>
                    }
                </div>
            </Card>
            {/* <Grid container justify={"center"} alignItems={"center"}>
                <Grid item xs={12} lg={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">
                                Welcome to Goaler
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid> */}
            </React.Fragment>
        )
    }
}

export default Login;