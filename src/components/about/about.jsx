import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import './about.css';

class About extends Component {
    render() {
        return (
            <div className="about">
                <Grid container justify={"center"} alignItems={"center"}>
                    <Grid item xs={12} lg={8}>
                        <Card className="about-card">
                            <CardContent>
                                <Typography variant={"h3"} align={"center"}>
                                    Thanks for using Goaler!
                                </Typography>
                                <br/>
                                <Typography variant={"h5"} align={"center"}>
                                    Contact me: <a href="mailto:leewarrick@gmail.com" rel="noopener noreferrer" target="_BLANK">leewarrick@gmail.com</a>
                                </Typography>
                                <br/>
                                <Typography variant={"h6"} align={"center"}>
                                    Background Images Courtesy of <a href="https://unsplash.com/">Unsplash</a> and <a href="https://picsum.photos">Lorem Picsum</a>
                                </Typography>
                                <br/>
                                <Typography variant={"h6"} align={"center"}>
                                    © Lee Warrick 2019. All Rights Reserved.
                                </Typography>
                            </CardContent> 
                        </Card>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default About;