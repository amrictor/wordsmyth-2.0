import React, { Component } from 'react';
import { getRGB } from '../utilities/color'

import { MdGavel as CurrentPlayer } from 'react-icons/md'

import "../styles/Scores.scss"

class Scores extends Component  {
    render() {
        
        return (
            <div className="scores">
                    {this.props.players.map(player => {
                        // let color = getRGB(player.color)
                        return (
                            <div 
                                title={player.judge ? player.name + " is the judge!" : player.name}
                                className="score"
                                style={getRGB(player.color)}
                            >
                                {player.name} : {player.score} <span className="judge" style={{visibility: (player.judge ? "visible" : "hidden")}}>{<CurrentPlayer/>} </span>
                            </div>
                        )
                    })}
            </div>
        )
    }
} export default Scores;