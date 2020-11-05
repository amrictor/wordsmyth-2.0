import React, { Component } from 'react';

import { MdGavel as CurrentPlayer } from 'react-icons/md'

import Quote from '../components/Quote';
import Scores from './Scores';
import WriteQuote from './WriteQuote';

import Timer from '../components/Timer/index'

import { getRGB } from '../utilities/color'

import "../styles/Game.scss"

const helperText = {
    '-1' : {
        judge: "Waiting for more players to join!",
        players:  "Waiting for more players to join!",
        first: "Click start whenever you're ready!"
    },
    0 : {
        judge: "Choose one of these real quotes! Your friends will make up their own endings for the one you choose!",
        players: "Waiting for the judge to choose a quote now!"
    },
    1 : {
        judge: "Waiting for your friends to write their own endings to the quote you've chosen!",
        players: "Finish the quote! Try to make it realistic so you can fool your friends. Here's a hint: check your spelling and punctuation!"
    },
    2 : {
        judge: "While you wait for your friends to guess the correct quote, feel free to award some bonus points for creativity!",
        players: "Which quote do you think is the real one? Think carefully..."
    },
    3 : {
        judge: "Let's see how everybody did!",
        players: "Let's see how everybody did!",
        first: "Click continue whenever you're ready!"
    },
    4 : {
        judge: "Well done, everybody!",
        players:  "Well done, everybody!"
    },
}

class Game extends Component {
    constructor(props){
        super(props);
        this.sendRequest = this.sendRequest.bind(this);
    }

    sendRequest(quote) {
        if(quote.target) quote ={}
        if(!this.props.status.expectedRequest) return;
        let request = this.props.status.expectedRequest;
        request.name = this.props.playerName;
        request.gameId = this.props.gameId;
        request.quote = quote;
        this.props.sendObject(request);
    }

    getRound(status) {
        let quotes = status.quotes || status.playerQuotes;
        if(quotes) {
            return (
                <div>
                    {status.phase !== 0 && (quotes.length>0
                        ? <div id="quoteorigin"> There's an old {quotes[0].origin} saying: </div> 
                        : <div id="emptyquotes"> Looks like no one submitted this round.<br/> Is everyone okay? </div>)}
                    {this.displayQuotes(status)}
                </div>
            )
        }
        return false;
    }

    displayQuotes(status) {
        if(status.quotes) {
            if(status.quotes.length > 1) return status.quotes.map( quote => <Quote status={status} quote={quote} sendRequest={this.sendRequest}/>)
            else return <WriteQuote quote={status.quotes[0]} disabled={!this.props.status.expectedRequest} sendRequest={this.sendRequest}/>
        } else if(status.playerQuotes) {
            return status.playerQuotes.map( quote => <Quote disabled={!this.props.status.expectedRequest} status={status} quote={quote} sendRequest={this.sendRequest}/>)
        }
    }

    render() {
        let { status , timer} = this.props;
        return (
            <div id="game">
                <div id="header" style={getRGB(status.player.color)}>
                    <div id="top">
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
                    {timer && timer.time > 0 && <Timer timer={timer}/>}
                </div>
                <div id="helperText">{helperText[status.phase][status.player.judge ? 'judge' : 'players']}</div>
                {this.getRound(status)}
                {status.phase===4 && 
                    <div id="winner">
                        <div style={getRGB(status.players[0].color)} className="player">
                            {status.players[0].name}
                        </div> 
                        won!
                    </div>}
                {status.expectedRequest && (status.phase === -1 || status.phase === 3) 
                    && <div id="waiting">
                            {helperText[status.phase].first}
                            <button onClick={this.sendRequest}>{status.expectedRequest.action}</button>
                        </div>}

                {
                    this.props.status.players && <Scores phase={status.phase} players={this.props.status.players}/>
                }
                {status.phase===4 && <button onClick={this.sendRequest}>{status.expectedRequest.action}</button>}

                {status.phase===4 && <div style={{height:'30%'}}/>}
            </div>
        )
    }

} export default Game;