import React, { Component } from 'react';

import Game  from './Game';
import Join from './Join';

import "../styles/Wordsmyth.scss"

class Wordsmyth extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playerName: "",
            gameId: "",
            status: {}
        }

        this.connection = null;

        this.handleServerCommunication = this.handleServerCommunication.bind(this);
        this.sendObject = this.sendObject.bind(this);
        this.create = this.create.bind(this);
        this.join = this.join.bind(this);
        this.leave = this.leave.bind(this);
        
    }

    componentDidMount() {
        this.connection = new WebSocket('ws://107.2.148.208:4444');
        this.connection.onopen = function () {
            console.log('Connected!');
        };
        // Log errors
        this.connection.onerror = function (error) {
            console.log('WebSocket Error ' + error);
            alert("Cannot reach server!")
        };
        // Log messages from the server
        this.connection.onmessage = function (e) {
          // console.log('Server: ' + e.data);
            let comm = JSON.parse(e.data);
            this.handleServerCommunication(comm);
        }.bind(this);
    
        this.connection.onclose = function (e) {
            console.log('Connection lost');
            // this.setCookie("", "")
          //THIS FUNCTION IS CALLED ON REFRESH IN FIREFOX BUT NOT CHROME
          // DELETING COOKIES BREAKS FUNCTIONALITY IN FIREFOX
        }.bind(this);
        this.checkCookie();
    }

    handleServerCommunication(comm) {
        switch(comm.type) {
            case'status': this.setState({status: comm},  document.documentElement.style.setProperty('--buttonColor', this.state.status.color)); break;
            case'response': {
                if(comm.message) {
                    if(comm.message.includes("No game with code") || comm.message.includes("Player does not exist")) {
                        this.setUser()
                    }
                    alert(comm.message);
                }
                else this.setUser(comm);
            };  break;
            case'time': {
                this.setState({timer: { time: comm.time, total: comm.total}})
                break;
            }
            case'quit': {
                this.setUser()
                break;
            }
            default: alert(JSON.stringify(comm))

        }
    }

    setUser(response) {
        let {playerName, gameId} = response ? response : {playerName : "", gameId: ""};
 
        this.setCookie(playerName, gameId, 1)
        this.setState({playerName: playerName, gameId: gameId})
    }

    sendObject(obj){
        let self = this;
        function waitForSocketConnection(callback){
            setTimeout(
                function () {
                    if (self.connection.readyState === 1) {
                        if (callback != null){
                            console.log(obj)
                            callback();
                        }
                    } else {
                        waitForSocketConnection(callback);
                    }

                }, 5); // wait 5 milisecond for the connection...
        }
        waitForSocketConnection(() => self.connection.send(JSON.stringify(obj)));
    }

    setCookie(playerName, gameId, exminutes=0) {
        console.log(playerName, gameId)
        var d = new Date();
        d.setTime(d.getTime() + (exminutes * 60 * 1000));
        var expires = (exminutes===0) ? "" : "max-age="+(exminutes * 60 * 1000) + ";path=/";
        document.cookie = "playerName=" + playerName + ";" + expires;
        document.cookie = "gameId=" + gameId + ";" + expires;
    }

    getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    checkCookie() {
        let playerName = this.getCookie("playerName");
        let gameId = this.getCookie("gameId");
        console.log(playerName, gameId)
        if (playerName !== undefined) {
            this.setState({playerName: playerName, gameId: gameId}, this.requestStatus);
        }
    }

    requestStatus() {
        if(this.state.playerName === "undefined" || this.state.gameId === "undefined") return
        let request = {
          'type': 'request',
          'action': 'status',
          'name': this.state.playerName,
          'gameId': this.state.gameId
        };
        this.sendObject(request);
    }

    create(){
        let username = document.getElementById("username").value;
        if(!username || username === "") alert("Please enter a username!")
        let request = {
          'type': 'request',
          'action': 'create',
          'name': document.getElementById("username").value
        };
        this.sendObject(request);
    }

    join(){
        let request = {
          'type': 'request',
          'action': 'join',
          'name': document.getElementById("username").value,
          'gameId': document.getElementById("gameid").value
        };
        this.sendObject(request);
    }
    
    leave(){
        let request = {
          'type': 'request',
          'action': 'leave',
          'name': this.state.playerName,
          'gameId': this.state.gameId
        };
        this.sendObject(request);
    }

    render() {
        if(this.state.status.player) return (
            <Game status={this.state.status} timer={this.state.timer} sendObject={this.sendObject} playerName={this.state.playerName} gameId={this.state.gameId}/>        
        );
        else return (
            <Join sendObject={this.sendObject}/>
        );
    }
} export default Wordsmyth;