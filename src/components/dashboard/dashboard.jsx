import React from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import List from '@material-ui/core/List';
import GoalForm from './goalform';
import GoalItem from './goalitem';
import RepeatForm from './repeatform';
import MultiGoalItem from './multigoalitem';
import Clock from './clock';
import CompletedCounter from './completedcounter';
import CenteredModal from './centeredModal';
import { withFirebase } from '../Firebase';
import { initializeSettings, getNewBackground } from '../settings/settings';
import './dashboard.css';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.unmounting = false;
        this.state = {
            goalModalOpen: false,
            repeatModalOpen: false,
            modalState: undefined,
            repeatModalState: undefined,
            goals: [],
            settings: {},
            settingsLoaded: false,
        };
    }
    componentDidMount = () => {
        this.props.firebase.db.collection(`users/${this.props.user.uid}/goals`)
        .onSnapshot((snapshot) => {
            const goals = [];
            snapshot.forEach(doc => goals.push({id: doc.id, ...doc.data()}))
            this.setState({goals});
        })
        const settingsRef = this.props.firebase.db.collection(`users/${this.props.user.uid}/settings`);
        settingsRef.onSnapshot((snapshot) => {
            // console.log(snapshot)
            if (!snapshot.empty) {
                const settings = {};
                // snapshot.forEach(doc => console.log(doc));
                snapshot.forEach(doc => settings[doc.id] = {id: doc.id, ...doc.data()});
                if (!this.unmounting) {
                    this.setState({settings, settingsLoaded: true});
                    if (settings.background && settings.background.url) {
                        document.body.style.backgroundImage = `url(${settings.background.url})`
                    }
                }
            } else {
                initializeSettings(settingsRef);
                getNewBackground(settingsRef);
            }
        })
    }

    toggleModal = modalState => {
        this.setState({
            goalModalOpen: !this.state.goalModalOpen,
            modalState: modalState ? modalState : null
        })
    }

    toggleRepeatModal = modalState => {
        this.setState({
            repeatModalOpen: !this.state.repeatModalOpen,
            repeatModalState: modalState ? modalState : null
        })
    }
    componentWillUnmount() {
        this.unmounting = true;
    }
    render() {
        return (
            <div className="dash">
                <div className="dash-items">
                    {
                        this.state.settingsLoaded && this.state.settings.clock.enabled &&
                        <div className="dash-item">
                            <Clock />
                        </div>
                    }
                    {
                        this.state.settingsLoaded && this.state.settings.completedCount.enabled &&
                        <div className="dash-item">
                            <CompletedCounter uid={this.props.user.uid}/>
                        </div>
                    }
                </div>
                <List>
                    {
                        this.state.goals
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
                            goal.multigoal
                            ? <MultiGoalItem key={goal.id} goal={goal}
                                toggleModal={this.toggleModal}
                                toggleRepeatModal={this.toggleRepeatModal}
                                user={this.props.user}/>
                            : <GoalItem key={goal.id} goal={goal}
                                toggleModal={this.toggleModal}
                                toggleRepeatModal={this.toggleRepeatModal}/>
                        ))
                    }
                </List>
                <CenteredModal open={this.state.goalModalOpen}
                    onClose={this.toggleModal}>
                    <GoalForm toggleModal={this.toggleModal} initialState={this.state.modalState}/>
                </CenteredModal>
                <CenteredModal open={this.state.repeatModalOpen}
                    onClose={this.toggleRepeatModal}>
                    <RepeatForm toggleRepeatModal={this.toggleRepeatModal} initialState={this.state.repeatModalState}/>
                </CenteredModal>
                <br/>
                <br/>
                <br/>
                <br/>
                <Fab color="secondary"
                    variant="extended"
                    aria-label="Add"
                    id="dash-addBtn"
                    onClick={this.toggleModal}>
                    <AddIcon />
                </Fab>
            </div>
        );
    }
}

export default withFirebase(Dashboard);