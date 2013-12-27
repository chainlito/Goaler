import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReplayIcon from '@material-ui/icons/Replay';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { withTheme } from '@material-ui/core/styles';
import { withFirebase } from '../Firebase';
import Timer from './timer';
import TimeDue from './timedue';
import TimeStamp from './timestamp';
import TimerCompleted from './timercompleted';
import './goalitem.css';

class GoalItem extends Component {
    constructor(props) {
        super(props);
        // console.log(props)
        this.state = {
            anchorEl: null,
            timeView: true
        };
        this.goalRef = props.goal.subgoal
        ? props.firebase.goalsRef.doc(`${props.parentGoal.id}/subgoals/${props.goal.id}`)
        : props.firebase.goalsRef.doc(props.goal.id);
    }

    componentDidMount() {
        if (this.props.deleteSelf) {
            this.goalRef.delete();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log("I rendered with", {props: this.props})
        if (prevProps.deleteSelf !== this.props.deleteSelf && this.props.deleteSelf) {
            this.goalRef.delete();
        }
    }
    handleMenuClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleCompleteToggle = () => {
        const d = new Date();
        const ms = d.getTime();
        const newCompletedStatus = !this.props.goal.completed
        this.goalRef.update({
            completed: newCompletedStatus,
            completedAt: newCompletedStatus ? ms : null
        });
        const countRef = this.props.firebase.settingsRef.doc('completedCount');
        countRef.get().then(doc => {
            const data = doc.data();
            let newCount;
            newCompletedStatus
                ? newCount = data.count + 1
                : newCount = data.count - 1;
            if (newCount < 0) newCount = 0;
            countRef.set({
                count: newCount,
                enabled: data.enabled
            });
        });

    }
    triggerModal = (subgoal, type) => {
        let modalToggleFn;
        switch(type) {
            case 'edit':
                modalToggleFn = this.props.toggleModal;
                break;
            case 'repeat':
                modalToggleFn = this.props.toggleRepeatModal;
                break;
            default:
                return;
        }
        if (subgoal) {
            // console.log(subgoal)
            modalToggleFn({
                parentGoalName: this.props.parentGoal.goal,
                parentGoalDate: this.props.parentGoal.date,
                parentGoalId: this.props.parentGoal.id,
                goal: this.props.goal.goal,
                date: this.props.goal.date,
                id: this.props.goal.id,
                multigoal: false,
                subgoal: true,
                timedgoal: this.props.goal.timedgoal,
                // closeMenu: this.handleClose
            })
        } else {
            modalToggleFn({
                goal: this.props.goal.goal,
                date: this.props.goal.date,
                id: this.props.goal.id,
                multigoal: this.props.goal.multigoal,
                subgoal: this.props.goal.subgoal,
                timedgoal: this.props.goal.timedgoal,
                // closeMenu: this.handleClose
            })
        }
        this.handleClose();
    }

    handleDelete = () =>{
        this.goalRef.delete();
        this.handleClose();
    }

    toggleTimeView = () => {
        this.setState({
            timeView: !this.state.timeView
        })
    }

    render() {
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        return (
            <React.Fragment>
                <ListItem className={this.props.goal.subgoal ? "goalItem-indent" : ""}
                    button onClick={this.toggleTimeView}>
                    {
                        this.state.timeView
                        ? <ListItemText
                        // className={}
                        primary={this.props.goal.goal}
                        secondary={this.props.goal.completed
                            ? <TimeStamp completed={this.props.goal.completedAt} />
                            : this.props.goal.timedgoal && <Timer date={this.props.goal.date} />
                        }
                        primaryTypographyProps={{
                            style: { width: '80%' },
                            className: this.props.goal.completed ? "goalitem-strike" : ""
                        }}
                        secondaryTypographyProps={{ color: 'error' }}
                        />
                        : <ListItemText
                        // className={this.props.goal.completed ? "goalitem-strike" : ""}
                        primary={this.props.goal.goal}
                        secondary={this.props.goal.completed
                            ? <React.Fragment>
                                {/* <TimeStamp completed={this.props.goal.completedAt} /><br/> */}
                                {/* <TimeStamp updated={this.props.goal.updatedAt} created={this.props.goal.createdAt}/><br/> */}
                                <TimerCompleted completed={this.props.goal.completedAt} updated={this.props.goal.createdAt}/>
                            </React.Fragment>
                            : this.props.goal.timedgoal && <React.Fragment>
                                {/* <TimeStamp updated={this.props.goal.updatedAt} created={this.props.goal.createdAt}/><br/> */}
                                <TimeDue date={this.props.goal.date}/><br/>
                            </React.Fragment>
                        }
                        primaryTypographyProps={{
                            style: { width: '80%' },
                            className: this.props.goal.completed ? "goalitem-strike" : ""
                        }}
                        secondaryTypographyProps={{ color: 'error' }}
                        />

                    }
                    <ListItemSecondaryAction>
                        <IconButton onClick={this.handleCompleteToggle}>
                            {
                                this.props.goal.completed
                                ? <CheckBoxIcon color="secondary"/>
                                : <CheckBoxOutlineBlankIcon />
                            }
                        </IconButton>
                        <IconButton onClick={this.handleMenuClick}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="long-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={this.handleClose}>
                            {
                                !this.props.goal.completed &&
                                <MenuItem
                                    onClick={() => this.triggerModal(this.props.goal.subgoal, "edit")}>
                                    <ListItemIcon>
                                        <EditIcon color={'inherit'}/>
                                    </ListItemIcon>
                                    <ListItemText inset primary="Edit" />
                                </MenuItem>
                            }
                            {
                                this.props.goal.completed &&
                                <MenuItem
                                    onClick={() => this.triggerModal(this.props.goal.subgoal, "repeat")}>
                                    <ListItemIcon>
                                        <ReplayIcon color="error" />
                                    </ListItemIcon>
                                    <ListItemText inset primary="Repeat"/>
                                </MenuItem>
                            }
                            <MenuItem onClick={this.handleDelete}>
                                <ListItemIcon>
                                    <DeleteIcon nativeColor={this.props.theme.palette.warn[500]}/>
                                </ListItemIcon>
                                <ListItemText inset primary="Delete" />
                            </MenuItem>
                        </Menu>
                    </ListItemSecondaryAction>
                </ListItem>
            </React.Fragment>
        )
    }
}

export default withTheme()(withFirebase(GoalItem));