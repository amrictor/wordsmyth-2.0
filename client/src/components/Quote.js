import React, { Component } from 'react';
import "../styles/Quote.scss";
import { getRGB } from '../utilities/color'
import { MdGavel as CurrentPlayer } from 'react-icons/md'

import { FaThumbsUp as BonusPoint } from 'react-icons/fa'

class Quote extends Component {

   

    render() {
        let {beginning, end, votes, origin, publicPlayer, bonus} =  this.props.quote;
        let {player, phase} = this.props.status;

        let className = "quoteBlock " + (votes ? "results" : "input");
        return (
            <div className={className} >
                <div className={'bonus_quote'}>
                    <div className={`bonus ${(player.judge || phase === 3) && bonus ? "visible" : "hidden" }`} title={publicPlayer && publicPlayer.name + " got a bonus point for creativity!"}><BonusPoint/></div>
                    <button 
                        onClick={()=> phase === 3 || this.props.sendRequest(this.props.quote)}
                        disabled={this.props.disabled || votes}
                        className={`box ${publicPlayer && publicPlayer.judge ? "correct" : ""}`}  
                        style={getRGB(publicPlayer?.color)}
                    >
                        <div className="quote">
                            {publicPlayer && <div className="player">
                                {publicPlayer.name}
                                <span 
                                    className="judge" 
                                    style={{visibility: (publicPlayer.judge ? "visible" : "hidden")}}
                                ><CurrentPlayer/></span>
                                </div>}

                                {phase===0 && <div className="origin">{origin}</div>}
                            {beginning + "... " + end}
                        </div>
                    </button>
                </div>
                <div>
                {votes && <div className="votes">
                    {votes.map(player => {
                        return (
                            <div
                                title={publicPlayer.judge ? `${player.name} voted for the correct quote!`: `${player.name} voted for ${publicPlayer.name}'s quote!`}
                                id={player.name + "_vote"} 
                                className="vote" 
                                style={getRGB(player.color)}>
                                    {player.name}
                            </div>
                        )
                    }
                    )}
                </div>}
                </div>
            </div>
        )
    }
} export default Quote;