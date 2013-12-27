import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Icon from '@material-ui/icons/AddAlarm'
import { withTheme } from '@material-ui/core/styles'
import { withFirebase } from '../Firebase';
import './goalform.css';

class GoalForm extends Component {
  constructor(props) {
    super(props);
    console.log(this.props)
    this.now = new Date();
    const plusOneDay = new Date(this.now.getTime() + (1000 * 60 * 60 * 24));
    const leadingZero = num => num < 10 ? "0" + num : num
    const tomorrow = `${plusOneDay.getFullYear()}-${leadingZero(plusOneDay.getMonth() + 1)}-${leadingZero(plusOneDay.getDate())}`
    this.today = `${this.now.getFullYear()}-${leadingZero(this.now.getMonth() + 1)}-${leadingZero(this.now.getDate())}`
    this.maxDate = `${this.now.getFullYear() + 10}-${leadingZero(this.now.getMonth() + 1)}-${leadingZero(this.now.getDate())}`
    this.currentTime = `${leadingZero(this.now.getHours())}:${leadingZero(this.now.getMinutes())}`;
    let initialState;
    if (this.props.initialState && this.props.initialState.date) {
      const milliseconds = this.props.initialState.date;
      let date = tomorrow;
      let time = this.currentTime;
      if (milliseconds > this.now.getTime()) {
        const d = new Date(milliseconds);
        date = `${d.getFullYear()}-${leadingZero(d.getMonth() + 1)}-${leadingZero(d.getDate())}`
        time = `${leadingZero(d.getHours())}:${leadingZero(d.getMinutes())}`;
      }
      initialState = {
        name: this.props.initialState.goal,
        nameErr: false,
        nameHelper: "",
        date,
        dateErr: false,
        dateHelper: "",
        time,
        timeErr: false,
        timeHelper: "",
        multigoal: this.props.initialState.multigoal ? true : false,
        subgoal: this.props.initialState.subgoal ? true : false,
        timedgoal: this.props.initialState.timedgoal ? true : false,
      }
    } else {
      initialState = {
        name: "",
        nameErr: false,
        nameHelper: "",
        date: tomorrow,
        dateErr: false,
        dateHelper: "",
        time: this.currentTime,
        timeErr: false,
        timeHelper: "",
        multigoal: this.props.initialState && this.props.initialState.multigoal
          ? true : false,
        subgoal: this.props.initialState && this.props.initialState.subgoal
          ? true : false,
        timedgoal: this.props.initialState && this.props.initialState.timedgoal
          ? true : false
      }
    }
    this.state = initialState;
    // console.log(this.state)
  }

  toggleMultigoal = () => {
    this.setState({
      multigoal: !this.state.multigoal
    })
  }

  toggleTimedgoal = () => {
    this.setState({
      timedgoal: !this.state.timedgoal
    })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.name !== this.state.name ||
      prevState.date !== this.state.date ||
      prevState.time !== this.state.time) {
      this.validate();
    }
  }

  validate = () => {
    //check if name
    let nameErr = false;
    let nameHelper = "";
    let dateErr = false;
    let dateHelper = "";
    let timeErr = false;
    let timeHelper = "";
    if (!this.state.name) {
      nameErr = true;
      nameHelper = "Please set a goal";
    }
    //check if date
    if (!this.state.date) {
      dateErr = true;
      dateHelper = "Please set a date";
    }
    //check if time
    if (!this.state.time) {
      timeErr = true;
      timeHelper = "Please set a time";
    }
    //get current date and time when form submits
    const now = new Date();
    const dateArgs = `${this.state.date} ${this.state.time}`.split(/[- :]/).map(str => Number(str));
    dateArgs[1]--; //month is 0 indexed
    const datetime = new Date(...dateArgs);
    // check if time/date is > now
    if (datetime.getTime() < now.getTime()) {
      if (datetime.toDateString() !== now.toDateString()) {
        dateErr = true;
        dateHelper = "Date must be in future";
      } else {
        timeErr = true;
        timeHelper = "Time must be in future";
      }
    }
    this.setState({
      nameErr,
      nameHelper,
      dateErr,
      dateHelper,
      timeErr,
      timeHelper,
    })
    if (timeErr || dateErr || nameErr) {
      return true;
    } else {
      return false;
    }
  }

  handleSubmit = () => {
    if (this.validate()) return;
    const dateArgs = `${this.state.date} ${this.state.time}`.split(/[- :]/)
      .map(str => Number(str));
    dateArgs[1]--; //month is 0 indexed
    const d = new Date(...dateArgs);
    const now = new Date();
    const n = now.getTime();
    if (this.props.initialState && this.props.initialState.goal) {
      if (this.state.subgoal) {
        // console.log(`updating sub goal`, this.state, this.props)
        this.props.firebase.goalsRef
          .doc(this.props.initialState.parentGoalId)
          .collection('subgoals')
          .doc(this.props.initialState.id)
          .update({
            goal: this.state.name,
            date: d.getTime(),
            multigoal: this.state.multigoal,
            subgoal: this.state.subgoal,
            timedgoal: this.state.timedgoal,
            completed: false,
            updatedAt: n
          })
          .then(() => {
            this.props.toggleModal();
            // this.props.initialState.closeMenu();
          })
      } else {
        // console.log(`updating regular goal`, this.state, this.props)
        this.props.firebase.goalsRef
          .doc(this.props.initialState.id)
          .update({
            goal: this.state.name,
            date: d.getTime(),
            multigoal: this.state.multigoal,
            subgoal: this.state.subgoal,
            timedgoal: this.state.timedgoal,
            completed: false,
            updatedAt: n
          })
          .then(() => {
            this.props.toggleModal();
            // this.props.initialState.closeMenu();
          })
      }
    } else if (!this.state.subgoal) {
      // console.log(`Adding regular goal`, this.state, this.props)
      this.props.firebase.goalsRef.add({
        goal: this.state.name,
        date: d.getTime(),
        multigoal: this.state.multigoal,
        subgoal: this.state.subgoal,
        timedgoal: this.state.timedgoal,
        completed: false,
        createdAt: n,
        updatedAt: n
      })
        .then(() => {
          this.props.toggleModal();
        })
    } else {
      // console.log(`Adding subgoal`, this.state, this.props)
      this.props.firebase.goalsRef
        .doc(this.props.initialState.parentGoalId)
        .collection('subgoals').add({
          goal: this.state.name,
          date: d.getTime(),
          multigoal: this.state.multigoal,
          subgoal: this.state.subgoal,
          timedgoal: this.state.timedgoal,
          completed: false,
          createdAt: n,
          updatedAt: n
        })
        .then(() => {
          this.props.toggleModal();
        })
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
              <Icon />
            </Avatar>
          }
          title="Add a goal"
          // subheader="With Chocolates"
          action={
            <IconButton onClick={this.props.toggleModal} tabIndex={-1}>
              <CloseIcon />
            </IconButton>
          }
        />
        <CardContent>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <TextField
                label="Goal"
                placeholder="Make it a good one!"
                error={this.state.nameErr}
                value={this.state.name}
                onChange={this.handleChange('name')}
                fullWidth
                margin="normal"
                helperText={this.state.nameHelper}
              />
            </Grid>
            { this.state.timedgoal &&
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Due Date"
                    error={this.state.dateErr}
                    type="date"
                    value={this.state.date}
                    onChange={this.handleChange('date')}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText={this.state.dateHelper}
                    InputProps={{
                      inputProps: {
                        min: this.today,
                        max: this.maxDate
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Due Time"
                    error={this.state.timeErr}
                    type="time"
                    value={this.state.time}
                    onChange={this.handleChange('time')}
                    margin="normal"
                    fullWidth
                    helperText={this.state.timeHelper}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </>
            }
            <Grid item xs={12} md={6}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.timedgoal}
                      onChange={this.toggleTimedgoal}
                      value={this.state.timedgoal}
                    />
                  }
                  label={
                    <Typography color={
                      this.state.timedgoal
                        ? "textPrimary"
                        : "textSecondary"
                    }>
                      Timed Goal
                    </Typography>
                  } />
                {
                  !this.state.subgoal && !this.props.initialState.subgoalsAdded &&
                  <FormControlLabel
                    control={
                      <Switch
                        checked={this.state.multigoal}
                        onChange={this.toggleMultigoal}
                        value={this.state.multigoal}
                      />
                    }
                    label={
                      <Typography color={
                        this.state.multigoal
                          ? "textPrimary"
                          : "textSecondary"
                      }>
                        Multi-Step Goal
                      </Typography>
                    } />
                }
              </FormGroup>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions className="row right">
          <Button onClick={this.handleSubmit}>
            {
              this.props.initialState && this.props.initialState.goal
                ? "Update " : "Add "
            }
            Goal
          </Button>
          <Button onClick={this.props.toggleModal}>Cancel</Button>
        </CardActions>
      </Card>
    )
  }
}

export default withTheme()(withFirebase(GoalForm));