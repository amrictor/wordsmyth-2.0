import React, { Component } from 'react';

import Input from '../components/Input/index';

import "../styles/Join.scss"

class Join extends Component {
    constructor(props) {
        super(props);
        this.state = {
            new: true,
            username: "",
            rounds: 3,
            timer: 60,
            gameId: ""
        }

        this.join = this.join.bind(this);
        this.create = this.create.bind(this);
    }

    join(){
        let request = {
          'type': 'request',
          'action': 'join',
          'name': this.state.username,
          'gameId': this.state.gameId
        };
        this.props.sendObject(request);
    }

    create(){
        if(!this.state.username || this.state.username === "") alert("Please enter a username!")
        let request = {
          'type': 'request',
          'action': 'create',
          'max_timer': this.state.timer,
          'max_rounds': this.state.rounds,
          'name': this.state.username
        };
        this.props.sendObject(request);
    }

    setField(key, value) {
        this.setState({[key]: value})
    }

    getInputs() {
        if(this.state.new) {
            return (
                <div id="form">
                    <Input
                        onChange={(event)=>this.setField("username", event.target.value)}
                        value={this.state.username}
                        type="text"
                        label="Player's name"
                    />
                    <div id="params">
                        <Input
                            onChange={(event)=>this.setField("rounds", event.target.value)}
                            value={this.state.rounds}
                            type="number"
                            label="Number of rounds"
                            min={1}
                            max={15}
                        />
                        <div className="spacer"/>
                        <Input
                            onChange={(event)=>this.setField("timer", event.target.value)}
                            value={this.state.timer}
                            type="number"
                            label="Timer (in seconds)"
                            min={30}
                            max={360}
                        />
                    </div>
                    <button onClick={this.create}>Create Game</button>
                </div>
            )
        } else  {
            return (
                <div id="form">
                    <Input
                        onChange={(event)=>this.setField("username", event.target.value)}
                        value={this.state.username}
                        type="text"
                        label="Player's name"
                    />
                    <Input
                        onChange={(event)=>this.setField("gameId", event.target.value)}
                        value={this.state.gameId}
                        type="text"
                        label="Room code"
                        pattern={/^[a-zA-Z0-9]{6}$/}
                        message="Game code must be alphanumeric and 6 characters long."
                    />
                    <button onClick={this.join}>Join Game</button>
                </div>
            )
        }
    }
    
    render() {
        return (
            <div id="join">
                <div className="nav">
                    <div className={`navitem ${this.state.new ? "selected" : ""}`} onClick={()=>this.setState({new: true})}>Start a new Game?</div>
                    <div className={`navitem ${!this.state.new  ? "selected" : ""}`} onClick={()=>this.setState({new: false})}>Or join a friend's?</div>
                </div>
                {this.getInputs()}
            </div>
        )
    }
} export default Join;