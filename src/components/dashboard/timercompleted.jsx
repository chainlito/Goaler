import React, { Component } from 'react';

class TimerCompleted extends Component {
    constructor(props) {
        super(props);
        const completed = props.completed;
        const updated = props.updated;
        const completionTime = completed - updated;
        let seconds = Math.round(completionTime / 1000) % 60;
        let minutes = Math.floor((completionTime / 1000) / 60) % 60;
        let hours = Math.floor((completionTime / 1000) / 3600) % 24;
        let days = Math.floor(((completionTime / 1000) / 3600) / 24);
        this.days = days < 10 ? '0' + days : days.toString();
        this.hours = hours < 10 ? '0' + hours : hours.toString();
        this.minutes = minutes < 10 ? '0' + minutes : minutes.toString();
        this.seconds = seconds < 10 ? '0' + seconds : seconds.toString();
    }
    render() {
        return (
            <React.Fragment>
                <span>{`Time: ${this.days}:${this.hours}:${this.minutes}:${this.seconds}`}</span><br/>
            </React.Fragment>
        )
    }
}

export default TimerCompleted;