package server.status;

import server.Request;

public class Response {

    private String type = "response";
    private String message;
    private String gameId;
    private String playerName;

    public Response() {
        this.gameId = "";
        this.playerName = "";
    }

    public Response(String message) {
        this.message = message;
    }

    public Response(Request request) {
        this.gameId = request.gameId;
        this.playerName = request.name;
    }
}