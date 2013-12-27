import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Chip from '@material-ui/core/Chip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AlarmIcon from '@material-ui/icons/Alarm'
import CloseIcon from '@material-ui/icons/Close';
import ReplayIcon from '@material-ui/icons/Replay';
import { withTheme } from '@material-ui/core/styles';
import { withFirebase } from '../Firebase';
import TimeDue from './timedue';
import Timer from './timer';
import './repeatform.css'

class RepeatForm extends Component {
    constructor(props) {
        super(props)
        const d = new Date();
        this.state = {
            now: d.getTime(),
            value: (1000 * 60 * 60 * 24).toString(),
            chip: true,
            formError: false,
            hours: "1",
            hoursErr: false,
            hoursErrMsg: "",
            minutes: "10",
            minutesErr: false,
            minutesErrMsg: "",
            days: "1",
            daysErr: false,
            daysErrMsg: "",
            weeks: "1",
            weeksErr: false,
            weeksErrMsg: "",
            goal: this.props.initialState.goal,
            goalErr: false,
            goalErrMsg: ""
        }
    }
    handleText = event => {
        const goal = event.target.value;
        let goalErr, goalErrMsg, formError;
        if (goal === "") {
            goalErr = true;
            goalErrMsg = "Must have goal name";
            formError = true;
        } else {
            goalErr = false;
            goalErrMsg = "";
            formError = false;
        }
        this.setState({goal, goalErr, goalErrMsg, formError});
    }

    handleTime = event => {
        const name = event.target.name;
        let unit;
        switch(name) {
            case 'hours':
                unit = 60;
                break;
            case 'minutes':
                unit = 1;
                break;
            case 'days':
                unit = 60 * 24;
                break;
            case 'weeks':
                unit = 60 * 24 * 7;
                break;
            default:
                break;
        }
        const num = Number(event.target.value)
        let Err;
        let ErrMsg;
        let hasError = false;
        if (num <= 0 || isNaN(num)) {
            Err = true;
            ErrMsg = "Time > 0"
            hasError = true;
        }
        this.setState({
            [name]: event.target.value,
            [name + "Err"]: Err,
            [ name + "ErrMsg"]: ErrMsg,
            formError: hasError,
            value: (1000 * 60 * unit * num).toString()
        })
    }

    handleChange = event => {
        const d = new Date();
        const value = event.target.value;
        this.setState({ 
            value,
            now: d.getTime()
        });
    };

    getMonth = months => {
        const d = new Date();
        const plusMonth = new Date();
        plusMonth.setMonth(d.getMonth() + months);
        let value = plusMonth.getTime() - d.getTime();
        value = value.toString();
        return value;
    }

    handleSubmit = () => {
        const goal = this.props.initialState;
        const collectionRef = goal.subgoal
            ? this.props.firebase.goalsRef.doc(goal.parentGoalId).collection('subgoals')
            : this.props.firebase.goalsRef
        collectionRef.add({
            goal: this.state.goal,
            date: (+this.state.value) + this.state.now,
            multigoal: goal.multigoal,
            subgoal: goal.subgoal,
            completed: false,
            createdAt: this.state.now,
            updatedAt: this.state.now
        })
        .then(() => {
            this.props.toggleRepeatModal();
        })
    }

    toggleChip = () => {
        this.setState({chip: !this.state.chip})
    }

    resetBadFields = () => {
        if (this.state.minutesErr) {
            this.setState({
                minutes: "10",
                minutesErr: false,
                minutesErrMsg: "",
                formError: false
            });
        }
        if (this.state.hoursErr) {
            this.setState({
                hours: "1",
                hoursErr: false,
                hoursErrMsg: "",
                formError: false
            });
        }
        if (this.state.daysErr) {
            this.setState({
                days: "1",
                daysErr: false,
                daysErrMsg: "",
                formError: false
            });
        }
        if (this.state.weeksErr) {
            this.setState({
                weeks: "1",
                weeksErr: false,
                weeksErrMsg: "",
                formError: false
            });
        }
        if (this.state.goalErr) {
            this.setState({
                goal: this.props.initialState.goal,
                goalErr: false,
                goalErrMsg: "",
                formError: false
            });
        }
    }

    render() {
        return (
            <Card className="goalform">
                <CardHeader
                    avatar={
                        <Avatar
                            style={{
                                backgroundColor: this.props.theme.palette.secondary.main,
                                color: this.props.theme.palette.text.primary
                            }}>
                            <ReplayIcon />
                        </Avatar>
                    }
                    title="Repeat Goal:"
                    // subheader={this.state.goal}
                    action={
                        <IconButton onClick={this.props.toggleRepeatModal} tabIndex={-1}>
                            <CloseIcon />
                        </IconButton>
                    }
                />
                <CardContent>
                    <Grid container spacing={0}>
                        <Grid item xs={12} className="repeatform-goalField">
                            <TextField
                                error={this.state.goalErr}
                                helperText={this.state.goalErrMsg}
                                inputProps={{
                                    step: 1,
                                    min: 1,
                                    required: true
                                }}
                                fullWidth
                                // label="Goal"
                                name="goal"
                                value={this.state.goal}
                                onBlur={this.resetBadFields}
                                onChange={this.handleText}/>
                        </Grid>
                        <Grid item xs={12}>
                            <RadioGroup className="repeatform-buttonGrp"
                                row={true}
                                aria-label="Repeat Time"
                                name="repeatTime"
                                value={this.state.value}
                                onChange={this.handleChange}>
                                <FormControlLabel value={(1000 * 60 * this.state.minutes).toString()} control={<Radio />} label={
                                    <div className="repeatform-hourInput-wrapper">
                                        <TextField
                                            classes={{root: "repeatform-hourInput"}}
                                            type="number"
                                            error={this.state.minutesErr}
                                            helperText={this.state.minutesErrMsg}
                                            inputProps={{
                                                step: 1,
                                                min: 1,
                                                required: true,
                                            }}
                                            InputProps={{
                                                endAdornment: 
                                                <InputAdornment position="end">
                                                    Minute{this.state.minutes === "1" ? '' : 's'}
                                                </InputAdornment>
                                            }}
                                            // label="Hours"
                                            name="minutes"
                                            className=""
                                            value={this.state.minutes}
                                            onBlur={this.resetBadFields}
                                            onChange={this.handleTime}/>
                                            {/* <span>Minute{this.state.minutes === "1" ? '' : 's'}</span> */}
                                    </div>
                                } />
                                <FormControlLabel value={(1000 * 60 * 60 * this.state.hours).toString()} control={<Radio />} label={
                                    <div className="repeatform-hourInput-wrapper">
                                        <TextField
                                            classes={{root: "repeatform-hourInput"}}
                                            type="number"
                                            error={this.state.hoursErr}
                                            helperText={this.state.hoursErrMsg}
                                            inputProps={{
                                                step: 1,
                                                min: 1,
                                                required: true
                                            }}
                                            InputProps={{
                                                endAdornment: 
                                                <InputAdornment position="end">
                                                    Hour{this.state.hours === "1" ? '' : 's'}
                                                </InputAdornment>
                                            }}
                                            // label="Hours"
                                            name="hours"
                                            className=""
                                            value={this.state.hours}
                                            onBlur={this.resetBadFields}
                                            onChange={this.handleTime}/>
                                            {/* <span>Hour{this.state.hours === "1" ? '' : 's'}</span> */}
                                    </div>
                                } />
                                <FormControlLabel value={(1000 * 60 * 60 * 24 * this.state.days).toString()} control={<Radio />} label={
                                    <div className="repeatform-hourInput-wrapper">
                                        <TextField
                                            classes={{root: "repeatform-hourInput"}}
                                            type="number"
                                            error={this.state.daysErr}
                                            helperText={this.state.daysErrMsg}
                                            inputProps={{
                                                step: 1,
                                                min: 1,
                                                required: true
                                            }}
                                            InputProps={{
                                                endAdornment: 
                                                <InputAdornment position="end">
                                                    Day{this.state.days === "1" ? '' : 's'}
                                                </InputAdornment>
                                            }}
                                            // label="Hours"
                                            name="days"
                                            className=""
                                            value={this.state.days}
                                            onBlur={this.resetBadFields}
                                            onChange={this.handleTime}/>
                                            {/* <span>Day{this.state.days === "1" ? '' : 's'}</span> */}
                                    </div>
                                } />
                                <FormControlLabel value={(1000 * 60 * 60 * 24 * 7 * this.state.weeks).toString()} control={<Radio />} label={
                                    <div className="repeatform-hourInput-wrapper">
                                        <TextField
                                            classes={{root: "repeatform-hourInput"}}
                                            type="number"
                                            error={this.state.weeksErr}
                                            helperText={this.state.weeksErrMsg}
                                            inputProps={{
                                                step: 1,
                                                min: 1,
                                                required: true
                                            }}
                                            InputProps={{
                                                endAdornment: 
                                                <InputAdornment position="end">
                                                    Week{this.state.weeks === "1" ? '' : 's'}
                                                </InputAdornment>
                                            }}
                                            // label="Hours"
                                            name="weeks"
                                            className=""
                                            value={this.state.weeks}
                                            onBlur={this.resetBadFields}
                                            onChange={this.handleTime}/>
                                            {/* <span>Week{this.state.weeks === "1" ? '' : 's'}</span> */}
                                    </div>
                                } />
                                <FormControlLabel value={this.getMonth(1)} control={<Radio />} label="One Month" />
                                <FormControlLabel value={this.getMonth(12)} control={<Radio />} label="One Year" />
                            </RadioGroup>
                        </Grid>
                        <Grid item xs={12} className="repeatform-chipWrapper">
                            <Chip tabIndex={-1}
                                color={this.state.chip ? "primary" : "secondary"}
                                icon={<AlarmIcon/>}
                                onClick={this.toggleChip}
                                label={
                                    this.state.chip
                                    ? <TimeDue date={this.state.now + (+this.state.value)}/>
                                    : <Timer date={this.state.now + (+this.state.value)}/> 
                                    }
                                />
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions className="row right">
                    <Button disabled={this.state.formError || +this.state.value === 0} onClick={this.handleSubmit}>
                        Submit
                    </Button>
                    <Button onClick={this.props.toggleRepeatModal}>Cancel</Button>
                </CardActions>
            </Card>
        )
    }
}

export default withTheme()(withFirebase(RepeatForm));