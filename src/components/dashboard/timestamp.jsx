import React, { Component } from 'react';

class TimeStamp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            created: "",
            updated: "",
            completed: "",
            timeStatus: ""
        }

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
            this.updateTime();
        }
    }

    componentDidMount() {
        this.updateTime();
    }

    updateTime = () => {
        const updated = new Date(this.props.updated);
        const created = new Date(this.props.created);
        const completed = new Date(this.props.completed);
        if (this.props.completed) {
            this.setState({
                timeStatus: "completed",
                completed: "Done: " + completed.toLocaleString()
            })
        } else if (this.props.updated === this.props.created) {
            this.setState({
                timeStatus: "created",
                created: "Created: " + created.toLocaleString()
            });
        } else {
            this.setState({
                timeStatus: "updated",
                updated: "Updated: " + updated.toLocaleString(),
                created: "Created: " + created.toLocaleString()
            });
        }
    }

    renderSpans = () => {
        //if created
        switch(this.state.timeStatus) {
            case 'completed':
                return (
                    <span>{this.state.completed}</span>
                )
            case 'created':
                return (
                    <span>{this.state.created}</span>
                )
            case 'updated':
                return (
                    <React.Fragment>
                        {/* <span>{this.state.created}</span><br/> */}
                        <span>{this.state.updated}</span>
                    </React.Fragment>
                )
            default:
                return;
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.renderSpans()}
            </React.Fragment>
        )
    }
}

export default TimeStamp;