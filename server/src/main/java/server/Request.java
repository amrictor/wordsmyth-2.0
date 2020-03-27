package server;

import com.google.gson.Gson;

import org.java_websocket.WebSocket;

import game.Quote;

public class Request {

    public String action;
    public String name;
    public String gameId;
    public Quote quote;
    
    public transient WebSocket conn;

    public Request(String gameId, String action) {
        this.gameId = gameId;
        this.action = action;
    }

    public String toString() {
        Gson gson = new Gson();
        return gson.toJson(this);
    }
}