import React, { Component } from 'react';

import { MdGavel as CurrentPlayer } from 'react-icons/md'

import Quote from './Quote';
import Scores from './Scores';
import WriteQuote from './WriteQuote';

import { getRGB } from '../utilities/color'

import "../styles/Game.scss"

class Game extends Component {
    constructor(props){
        super(props);
        this.sendRequest = this.sendRequest.bind(this);
    }

    // const phases = {
    //     -1 : ""
    // }

    sendRequest(quote) {
        // console.log("choose")
        if(!this.props.status.expectedRequest) return;
        let request = this.props.status.expectedRequest;
        request.name = this.props.playerName;
        request.gameId = this.props.gameId;
        request.quote = quote;
        this.props.sendObject(request);
    }

    getRound(status) {
        let quotes = status.quotes || status.playerQuotes;
        console.log(quotes);
        if(quotes) {
            return (
                <div>
                    <div id="quoteorigin"> There's an old {quotes[0].origin} saying: </div>
                    {this.displayQuotes(status)}
                </div>
            )
        }
        return false;
    }

    displayQuotes(status) {
        if(status.quotes) {
            if(status.quotes.length > 1) return status.quotes.map( quote => <Quote status={status} quote={quote} sendRequest={this.sendRequest}/>)
            else return <WriteQuote quote={status.quotes[0]} sendRequest={this.sendRequest}/>
        } else if(status.playerQuotes) {
            return status.playerQuotes.map( quote => <Quote status={status} quote={quote} sendRequest={this.sendRequest}/>)
        }
    }

    render() {
        let status = this.props.status;



        return (
            <div id="game">
                <div id="header" style={getRGB(status.player.color)}>
                    <div id="title">Wordsmyth</div>
                    <div id="info" >
                        
                        <div id="username">
                            {this.props.playerName}
                            <span 
                                className="judge" 
                                title="You're the judge this round!"
                                style={{visibility: (status.player.judge ? "visible" : "hidden")}}
                            >
                                <CurrentPlayer/>
                            </span>    
                        </div>
                        <div id="gameid">{status.gameId}</div>
                    </div>
                </div>
                {this.getRound(status)}
                {!status.expectedRequest && <div id="waiting">Waiting to move to the next round!</div>}
                {status.expectedRequest && (status.phase === -1 || status.phase === 3) && <button onClick={this.sendRequest}>{status.expectedRequest.action}</button>}

                {
                    this.props.status.players && <Scores players={this.props.status.players}/>
                }
            </div>
        )
    }

} export default Game;