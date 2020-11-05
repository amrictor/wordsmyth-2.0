import React, { Component } from 'react';

import Game  from './Game';
import Join from './Join';

import * as env from "../env.json"
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
        this.mounted = true;
        const address = `ws${env.USE_WSS ? 's' : ''}://${env.SERVER_ADDRESS}`
        this.connection = new WebSocket(address);
        const onOpen = () => {
            console.log('Connected!');
        }
        const onError = (error) => {
            console.log('WebSocket Error ' + error);
            alert("Cannot reach server!")
        };
        const onMessage = (e) => {
            let comm = JSON.parse(e.data);
            this.handleServerCommunication(comm);
        }
        const onClose = () => {
            if(this.mounted) {
                this.connection = new WebSocket(address);
                this.connection.onopen = onOpen;
                this.connection.onerror = onError;
                this.connection.onmessage = onMessage;
                this.connection.onclose = onClose;
            }
            //THIS FUNCTION IS CALLED ON REFRESH IN FIREFOX BUT NOT CHROME
            // DELETING COOKIES BREAKS FUNCTIONALITY IN FIREFOX
        }
        this.connection.onopen = onOpen;
        this.connection.onerror = onError;
        this.connection.onmessage = onMessage;
        this.connection.onclose = onClose;
        this.checkCookie();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    handleServerCommunication(comm) {
        switch(comm.type) {
            case'status': this.setState({status: comm},  document.documentElement.style.setProperty('--buttonColor', this.state.status.color)); break;
            case'response': 
                if(comm.message) {
                    if(comm.message.includes("No game with code") || comm.message.includes("Player does not exist")) {
                        this.setUser()
                    }
                    alert(comm.message);
                }
                else this.setUser(comm);
            ;  break;
            case'time': {
                this.setState({timer: { time: comm.time, total: comm.total}})
                break;
            }
            case'quit': {
                this.setUser();
                window.location.reload();
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