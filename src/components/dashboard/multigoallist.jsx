import React, { Component } from 'react';
import List from '@material-ui/core/List';
import Collapse from '@material-ui/core/Collapse';
import GoalItem from './goalitem';
import { withFirebase } from '../Firebase';

class MultiGoalList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subgoals: []
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.deleteInProgress && this.state.subgoals.length === 0) {
            this.props.deleteParent();
        }
    }

    componentDidMount() {
        this.props.firebase.db
            .collection(`users/${this.props.user.uid}/goals/${this.props.parentGoal.id}/subgoals`)
            .onSnapshot((snapshot) => {
                const subgoals = [];
                snapshot.forEach(doc => subgoals.push({ id: doc.id, ...doc.data() }))
                const completed = subgoals.filter(goal => goal.completed);
                const completePercentage = Math.round(completed.length / subgoals.length * 100);
                this.props.updateProgress(completePercentage);
                this.setState({ subgoals });
            })
    }

    render() {
        return (
            <Collapse in={this.props.open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        this.state.subgoals
                            .sort((goalA, goalB) => {
                              const diff = goalA.date - goalB.date
                              if (goalA.completed === goalB.completed && goalA.timedgoal && goalB.timedgoal) {
                                  return diff;
                              } else if (goalA.completed === goalB.completed && goalA.timedgoal !== goalB.timedgoal) {
                                  return goalA.timedgoal ? -1 : 1
                              } else if (goalA.completed && !goalB.completed) {
                                return 1;
                              } else if (!goalA.completed && goalB.completed){
                                  return -1;
                              } else {
                                return diff;
                              }
                            })
                            .map(goal => (
                                <GoalItem key={goal.id} goal={goal}
                                    toggleModal={this.props.toggleModal}
                                    toggleRepeatModal={this.props.toggleRepeatModal}
                                    parentGoal={this.props.parentGoal}
                                    deleteSelf={this.props.deleteInProgress}/>
                            ))
                    }
                </List>
            </Collapse>
        );
    }
}

export default withFirebase(MultiGoalList);