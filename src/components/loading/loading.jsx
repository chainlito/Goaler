import React, { Component } from 'react';
import './loading.css';
import CircularProgress from '@material-ui/core/CircularProgress';

class Loading extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <React.Fragment>
            {
                this.props.status ? 
                    <div className="loading">
                        <CircularProgress color="secondary" size={200}/>
                    </div> :
                    this.props.children
            }
            </React.Fragment>
        )
    }
}

export default Loading;