import React from 'react';
import './timer.css';
class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.unMounting = false;
        const timeRemaining = this.checkTime();
        this.state = {
            time: {},
            counting: timeRemaining > 0 ? true : false,
            classes: ""
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.date !== this.props.date) {
            this.updateTime();
        }
    }
    componentDidMount() {
        if (this.props.date /* && this.state.counting */) {
            this.updateTime();
        }
    }
    checkTime = () => {
        const future = this.props.date;
        const d = new Date();
        const now = d.getTime();
        const timeRemaining = future - now;
        return timeRemaining;
    }
    updateTime = () => {
        if (this.unMounting) return;
        // var future = Date.parse("December 31, 2019");
        let timeRemaining = this.checkTime();
        let counting;
        timeRemaining < 0 ? counting = false : counting = true;
        timeRemaining = Math.abs(timeRemaining);
        // console.log(timeRemaining)
        // if (timeRemaining < 1000) {
        //     return this.setState({
        //         time: {
        //             days: "00",
        //             hours: "00",
        //             minutes: "00",
        //             seconds: "00"
        //         },
        //         counting: false,
        //         // classes: "timer-strike_animate"
        //     });
        // }
        let seconds = Math.floor(timeRemaining / 1000) % 60;
        let minutes = Math.floor((timeRemaining / 1000) / 60) % 60;
        let hours = Math.floor((timeRemaining / 1000) / 3600) % 24;
        let days = Math.floor(((timeRemaining / 1000) / 3600) / 24);
        days = days < 10 ? '0' + days : days.toString();
        hours = hours < 10 ? '0' + hours : hours.toString();
        minutes = minutes < 10 ? '0' + minutes : minutes.toString();
        seconds = seconds < 10 ? '0' + seconds : seconds.toString();
        this.setState({
            time: {
                days, hours, minutes, seconds
            },
            counting: counting
        });
        requestAnimationFrame(this.updateTime);
    }

    componentWillUnmount() {
        this.unMounting = true;
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.state.counting
                    ? <span className={this.state.classes}>
                        Due in:
                        {` ${this.state.time.days}:` +
                            `${this.state.time.hours}:` +
                            `${this.state.time.minutes}:` +
                            `${this.state.time.seconds}`}
                    </span>
                    : <span className="timer-strike">
                        Past Due:
                        {` ${this.state.time.days}:` +
                            `${this.state.time.hours}:` +
                            `${this.state.time.minutes}:` +
                            `${this.state.time.seconds}`}
                    </span>
                    // : <span className="timer-strike">00:00:00:00</span>
                }
            </React.Fragment>
        )
    }
}

export default Timer;