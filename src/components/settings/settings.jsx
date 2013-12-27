import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import './settings.css';
import Loading from '../loading/loading';
import CompletedCounter from '../dashboard/completedcounter';
import Clock from '../dashboard/clock';
import { withFirebase } from '../Firebase';

function initializeSettings(settingsRef) {
    settingsRef.doc('completedCount').set({ count: 0, enabled: true });
    settingsRef.doc('clock').set({ enabled: true });
}

function getNewBackground(settingsRef) {
    fetch('https://picsum.photos/g/1920/1200/?random')
    .then(res => {
        if (res.status === 200) {
            document.body.style.backgroundImage = `url(${res.url})`
            settingsRef.doc('background').set({ url: res.url });
        } else {
            document.body.style.backgroundImage = 'none'
        }
    });
}

class Settings extends Component {

    constructor(props) {
        super(props);
        this.unmounting = false;
        this.settingsRef = this.props.firebase.db.collection(`users/${this.props.user.uid}/settings`);
        this.state = {
            loading: true,
            settings: {}
        }
    }

    componentDidMount() {
        this.settingsRef.onSnapshot((snapshot) => {
            const settings = {};
            // snapshot.forEach(doc => settings.push({id: doc.id, ...doc.data()}))
            snapshot.forEach(doc => settings[doc.id] = {id: doc.id, ...doc.data()});
            if (!this.unmounting) {
                this.setState({settings, loading: false});
            }
        });
    }

    componentWillUnmount() {
        this.unmounting = true;
    }

    toggleEnableSwitch = setting => {
        this.settingsRef.doc(setting).update({ enabled: !this.state.settings[setting].enabled})
    }

    render() {
        return (
        <Loading status={this.state.loading}>
            <div className="settings-wrapper">
                {/* <h1>{JSON.stringify(this.state.settings)}</h1> */}
                <Typography variant="h4" align="center" className="settings-title">
                    Settings
                </Typography>
                <form>
                    <Grid container justify="center" className="settings__setting-row">
                        <Grid item xs={12} md={6}>
                            <div className="settings__column-wrapper--center">
                                <Typography variant="h6">
                                    Completed Goals Counter
                                </Typography>
                                <CompletedCounter uid={this.props.user.uid} />
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className="settings__column-wrapper--center">
                                {
                                    this.state.settings.completedCount &&
                                    <FormGroup row>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                checked={this.state.settings.completedCount.enabled}
                                                onChange={() => this.toggleEnableSwitch(this.state.settings.completedCount.id)}
                                                value={this.state.settings.completedCount.enabled}
                                                />
                                            }
                                            label={
                                                <Typography color={
                                                    this.state.settings.completedCount.enabled
                                                    ? "textPrimary"
                                                    : "textSecondary"
                                                }>
                                                    Enable Complete Counter
                                                </Typography>
                                            }/>
                                    </FormGroup>
                                }
                            </div>
                        </Grid>
                    </Grid>
                    <Divider variant='middle' />
                    <Grid container justify="center" className="settings__setting-row">
                        <Grid item xs={12} md={6}>
                            <div className="settings__column-wrapper--center">
                                <Typography variant="h6">
                                    Clock
                                </Typography>
                                <Clock uid={this.props.user.uid} />
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className="settings__column-wrapper--center">
                                {
                                    this.state.settings.clock &&
                                    <FormGroup row>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                checked={this.state.settings.clock.enabled}
                                                onChange={() => this.toggleEnableSwitch(this.state.settings.clock.id)}
                                                value={this.state.settings.clock.enabled}
                                                />
                                            }
                                            label={
                                                <Typography color={
                                                    this.state.settings.clock.enabled
                                                    ? "textPrimary"
                                                    : "textSecondary"
                                                }>
                                                    Enable Clock
                                                </Typography>
                                            }/>
                                    </FormGroup>
                                }
                            </div>
                        </Grid>
                    </Grid>
                    <Divider variant='middle' />
                    <Grid container justify="center" className="settings__setting-row">
                        <Grid item xs={12} md={6}>
                            <div className="settings__column-wrapper--center">
                                <Typography variant="h6">
                                    Background
                                </Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className="settings__column-wrapper--center">
                                {
                                    // this.state.settings.background &&
                                    true &&
                                    <Button variant="contained" color="primary" onClick={() => getNewBackground(this.settingsRef)}>
                                        Shuffle Background
                                    </Button>
                                }
                            </div>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Loading>
        )
    }
}

export default withFirebase(Settings);

export { initializeSettings, getNewBackground };