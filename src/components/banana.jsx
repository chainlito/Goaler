import React from 'react';

const Banana = props => {
    return (
        <h3>{props.text} x{props.match.params.num} {props.user.displayName}</h3>
    )
}

export default Banana