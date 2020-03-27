import React, { Component } from 'react';

import "../styles/Join.scss"

class Join extends Component {
    constructor(props) {
        super(props);
        this.state = {
            new: false
        }

        this.join = this.join.bind(this);
        this.create = this.create.bind(this);
    }

    join(){
        let request = {
          'type': 'request',
          'action': 'join',
          'name': document.getElementById("username").value,
          'gameId': document.getElementById("gameid").value
        };
        this.props.sendObject(request);
    }

    create(){
        let username = document.getElementById("username").value;
        if(!username || username === "") alert("Please enter a username!")
        let request = {
          'type': 'request',
          'action': 'create',
          'name': document.getElementById("username").value
        };
        this.props.sendObject(request);
    }

    getInputs() {
        if(this.state.new) {
            return (
                <div id="form">
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder= {"Username" }
                    />
                    <button onClick={this.create}>Create Game</button>
                </div>
            )
        } else  {
            return (
                <div id="form">
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder= {"Username" }
                    />
                    <input
                        type="text"
                        id="gameid"
                        name="gameid"
                        placeholder= {"Game ID" }
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