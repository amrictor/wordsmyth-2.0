package server;

import com.google.gson.Gson;

import org.java_websocket.WebSocket;

import game.Quote;

public class Request {

    public String action;
    public String name;
    public String gameId;
    public short max_timer;
    public short max_rounds;
    public Quote quote;
    
    public transient WebSocket conn;

    public Request(String gameId, String action) {
        this.gameId = gameId;
        this.action = action;
    }

    public void verifyValues() {
        if(max_timer <= 10) max_timer = 60;
        if(max_rounds <= 0) max_rounds = 3;
    }

    public String toString() {
        Gson gson = new Gson();
        return gson.toJson(this);
    }
}