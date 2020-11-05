import React, { Component } from 'react';

import './styles.scss'


class Timer extends Component {
    render() {
        const { timer } = this.props
        return (
            <div className="wordsmyth_timer">
                <div className='timer' style={{width: `${parseInt(timer.time)/parseInt(timer.total)*100}%`}}></div>
            </div>
        )
    }
} export default Timer;