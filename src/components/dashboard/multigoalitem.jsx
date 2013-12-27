import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
// import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
// import CheckBoxIcon from '@material-ui/icons/CheckBox';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { withTheme } from '@material-ui/core/styles';
import { withFirebase } from '../Firebase';
import MultiGoalList from './multigoallist';
import Timer from './timer';
import TimeDue from './timedue';
import TimeStamp from './timestamp';
import TimerCompleted from './timercompleted';
import './multigoalitem.css';

class MultiGoalItem extends Component {
    constructor(props) {
        super(props);
        // console.log(props)
        this.state = {
            anchorEl: null,
            timeView: true,
            subgoalsOpen: props.goal.multigoal ? false : null,
            progress: 0,
            subgoalsAdded: false,
            loading: true,
            deleteInProgress: false,
        };
        this.goalRef = props.goal.subgoal
        ? props.firebase.goalsRef.doc(`${props.parentGoal.id}/subgoals/${props.goal.id}`)
        : props.firebase.goalsRef.doc(props.goal.id);
    }
    // componentDidUpdate() {
    //     console.log("I rendered with", {props: this.props})
    // }
    handleMenuClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleCompleteToggle = () => {
        if (document.hidden) { return; }
        // if (this.props.goal.metadata.fromCache) return;
        if ((this.state.progress === 100 && !this.props.goal.completed) ||
        (this.state.progress !== 100 && this.props.goal.completed)) {
            const d = new Date();
            const ms = d.getTime();
            const newCompletedStatus = !this.props.goal.completed
            this.goalRef.update({
                completed: newCompletedStatus,
                completedAt: newCompletedStatus ? ms : null
            });
        }
        // const countRef = this.props.firebase.settingsRef.doc('completedCount');
        // countRef.get().then(doc => {
        //     const data = doc.data();
        //     let newCount;
        //     newCompletedStatus
        //         ? newCount = data.count + 1
        //         : newCount = data.count - 1
        //     if (newCount < 0) newCount = 0;
        //     countRef.set({
        //         count: newCount
        //     })
        // })

    }
    triggerModal = (subgoal) => {
        if (subgoal) {
            // console.log(subgoal)
            this.props.toggleModal({
                parentGoalName: this.props.goal.goal,
                parentGoalDate: this.props.goal.date,
                parentGoalId: this.props.goal.id,
                multigoal: false,
                subgoal: true,
                subgoalsAdded: this.state.subgoalsAdded,
                timedgoal: this.props.goal.timedgoal,
                // closeMenu: this.handleClose
            })
        } else {
            this.props.toggleModal({
                goal: this.props.goal.goal,
                date: this.props.goal.date,
                id: this.props.goal.id,
                multigoal: this.props.goal.multigoal,
                subgoal: this.props.goal.subgoal,
                subgoalsAdded: this.state.subgoalsAdded,
                timedgoal: this.props.goal.timedgoal,
                // closeMenu: this.handleClose
            })
        }
        this.handleClose();
    }
    startDelete = () => {
        // this.goalRef.delete();
        this.setState({
            subgoalsOpen: true,
            deleteInProgress: true,
        })
        this.handleClose();
    }

    finishDelete = () => {
        this.goalRef.delete();
    }

    toggleTimeView = () => {
        this.setState({
            timeView: !this.state.timeView
        })
    }
    toggleSubgoals = () => {
        this.setState({
            subgoalsOpen: !this.state.subgoalsOpen
        })
    }

    updateProgress = newPercentage => {
        // console.log(newPercentage)
        this.setState({
            progress: newPercentage,
            subgoalsAdded: isNaN(newPercentage) ? false : true,
            loading: false
        });
        if (newPercentage === 100 && !this.props.goal.completed) {
            setTimeout(() => this.handleCompleteToggle(), 500)
            // this.handleCompleteToggle();
        } else if (newPercentage !== 100 && this.props.goal.completed) {
            setTimeout(() => this.handleCompleteToggle(), 500)
            // this.handleCompleteToggle();
        }
    }

    render() {
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        return (
            <React.Fragment>
                <ListItem className={this.props.goal.subgoal ? "goalitem-indent" : ""}
                    button onClick={this.toggleTimeView}>
                    {
                        this.state.timeView
                        ? <ListItemText
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
                        primary={this.props.goal.goal}
                        secondary={this.props.goal.completed
                            ? <React.Fragment>
                                {/* <TimeStamp completed={this.props.goal.completedAt} /><br/> */}
                                {/* <TimeStamp updated={this.props.goal.updatedAt} created={this.props.goal.createdAt}/><br/> */}
                                <TimerCompleted completed={this.props.goal.completedAt} updated={this.props.goal.createdAt}/>
                            </React.Fragment>
                            : this.props.goal.timedgoal
                              ? <React.Fragment>
                                  {/* <TimeStamp updated={this.props.goal.updatedAt} created={this.props.goal.createdAt}/><br/> */}
                                  <TimeDue date={this.props.goal.date}/><br/>
                              </React.Fragment>
                              : <span>{this.state.progress}% Complete</span>
                        }
                        primaryTypographyProps={{
                            style: { width: '80%' },
                            className: this.props.goal.completed ? "goalitem-strike" : ""
                        }}
                        secondaryTypographyProps={{ color: 'error' }}
                        />

                    }
                    <ListItemSecondaryAction>
                        {
                            this.state.subgoalsAdded
                            ? !this.state.loading &&
                            <IconButton onClick={this.toggleSubgoals}>
                                {
                                    this.state.subgoalsOpen
                                    ? <ExpandLess/>
                                    : <ExpandMore/>
                                }
                            </IconButton>
                            : !this.state.loading &&
                            <IconButton variant="raised"
                                onClick={() => this.triggerModal(true)}>
                                <AddIcon />
                            </IconButton>
                        }
                        <IconButton onClick={this.handleMenuClick}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="long-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={this.handleClose}>
                            {
                                this.props.goal.multigoal &&
                                //trigger modal with subgoal flag
                                <MenuItem onClick={() => this.triggerModal(true)}>
                                    <ListItemIcon>
                                        <AddIcon color={'inherit'}/>
                                    </ListItemIcon>
                                    <ListItemText inset primary="Add Sub Goal" />
                                </MenuItem>
                            }
                            {
                                !this.props.goal.completed &&
                                <MenuItem onClick={() => this.triggerModal(false)}>
                                    <ListItemIcon>
                                        <EditIcon color={'inherit'}/>
                                    </ListItemIcon>
                                    <ListItemText inset primary="Edit" />
                                </MenuItem>
                            }
                            <MenuItem onClick={this.startDelete}>
                                <ListItemIcon>
                                    <DeleteIcon nativeColor={this.props.theme.palette.warn[500]}/>
                                </ListItemIcon>
                                <ListItemText inset primary="Delete" />
                            </MenuItem>
                        </Menu>
                    </ListItemSecondaryAction>
                </ListItem>
                {
                    !this.state.loading && this.state.subgoalsAdded &&
                    <LinearProgress className="goalItem-progress"
                        color="secondary" variant="determinate" value={this.state.progress} />
                }
                {
                    this.props.goal.multigoal &&
                    <MultiGoalList
                        open={this.state.subgoalsOpen}
                        parentGoal={this.props.goal}
                        user={this.props.user}
                        toggleModal={this.props.toggleModal}
                        toggleRepeatModal={this.props.toggleRepeatModal}
                        updateProgress={this.updateProgress}
                        deleteParent={this.finishDelete}
                        deleteInProgress={this.state.deleteInProgress}/>
                }
            </React.Fragment>
        )
    }
}

export default withTheme()(withFirebase(MultiGoalItem));