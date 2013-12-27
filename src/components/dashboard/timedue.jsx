import React from 'react';
import './timedue.css'

const TimeDue = props => {
    const ms = props.date;
    const now = new Date();
    const nowMs = now.getTime();
    const diff = nowMs - ms;
    const d = new Date(ms);
    return (
        <span className={diff > 0 ? "timedue" : ""}>Due: {d.toLocaleString()}</span>
    )
};

export default TimeDue;