import React, {Component} from 'react'
import Chip from '@material-ui/core/Chip';
import { withFirebase } from '../Firebase';
class CompletedCounter extends Component {
    constructor(props) {
        super(props);
        this.unmounting = false;
        this.state = {completeCount: ""}
        // console.log(props)
    }

    componentDidMount() {
        const completedRef = this.props.firebase.db.collection(`users/${this.props.uid}/settings`)
        .doc('completedCount');

        completedRef.onSnapshot(snapshot => {
            const data = snapshot.data()
            if (!this.unmounting) {
                this.setState({ completeCount: data.count })
            }
        })
    }

    componentWillUnmount() {
        this.unmounting = true;
    }

    render() {
        return (
            <Chip color="primary" label={`Completed Goals: ${this.state.completeCount}`} />
        )
    }
}

export default withFirebase(CompletedCounter);