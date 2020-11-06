package server;

import game.*;
import server.status.Response;

import java.net.InetSocketAddress;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Random;
import java.util.Timer;
import java.util.TimerTask;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.WebSocket;
import org.java_websocket.server.WebSocketServer;

public class WebsocketServer extends WebSocketServer {
    private static int TCP_PORT = 4444;
    private TimerTask garbageCollector;
    private Timer timer = new Timer();
    private Map<String, Game> games; 
    private Quote[] quotes;

    public WebsocketServer() {
        super(new InetSocketAddress(TCP_PORT));
        quotes = new QuoteReader().getQuotes();
        games = new HashMap<>();
        garbageCollector = new TimerTask() {
            public void run() {
                Iterator<Game> it = games.values().iterator();
                while(it.hasNext()) {
                    Game g = it.next();
                    if(!g.checkConnections()) {
                        g.cancelTimer();
                        it.remove();
                    }
                }
            }
        };
        timer.scheduleAtFixedRate(
            garbageCollector,
            0,      // run first occurrence immediately
            6000
        ); 
       
    }

    @Override
	public void onStart() {
        System.out.printf("Starting server on port %d\n", TCP_PORT); 
	}

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        System.out.println("New connection from " + conn.getRemoteSocketAddress().getAddress().getHostAddress());
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        System.out.println("Closing connection.");
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        System.out.println("Message from client: " + message);
        handleRequest(conn, message);
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        ex.printStackTrace();
        if (conn != null) {
            System.out.println("ERROR from " + conn.getRemoteSocketAddress().getAddress().getHostAddress());
        }
        else System.out.println("ERROR: Connection does not exist");
    }

    private Request getRequest(String message) {
        JsonParser jp = new JsonParser();
        JsonElement body = jp.parse(message);
        Gson gson = new Gson();
        return gson.fromJson(body, Request.class);
    }

    private void handleRequest(WebSocket conn, String message) {
        Request request = getRequest(message);
        request.conn = conn;
        updatePlayerConnection(request);

        switch(request.action) {
            case "status": getGameStatus(request); break;
        
            case "create": createGame(request); break;
            case "join": joinGame(request); break;
            case "leave": leaveGame(request); break;

            case "start": startGame(request); break;
            case "select": selectQuote(request); break;
            case "submit": submitQuote(request); break;
            case "vote" : vote(request); break;
            case "bonus" : giveBonusPoints(request); break;

            case "continue": nextRound(request); break;
            case "quit": quitGame(request); break;

            default: System.out.printf("The action \"%s\" is not accounted for.\n", request.action);
        }
    }

    private void quitGame(Request request) {
        Game game = games.get(request.gameId);
        game.quitGame();
        games.remove(request.gameId);
    }

    private void updatePlayerConnection(Request request) {
        if(request.action.equals("create") || request.action.equals("join")) return;
        if(request.gameId.length() < 6) return;
        if(request.name.equals("")) return;
        try {
            Game game = games.get(request.gameId);
            if(game == null) return;
            game.updateConnection(request.name, request.conn);
        } catch (GameException e) {
            sendResponse(request.conn, new Response(e.getMessage()));
        }  
    }

    private void sendResponse(WebSocket conn, Object obj) {
        Gson gson = new Gson();
        String json = gson.toJson(obj);
        conn.send(json);
    }
    
    private void getGameStatus(Request request) {
        if(request.gameId.length() < 6) return;
        Game game = games.get(request.gameId);
        try {
            if(game == null) throw new GameException("No game with code \"" + request.gameId +"\" exists!");
            game.updatePlayer(request.name);
        } catch (GameException e) {
            sendResponse(request.conn, new Response(e.getMessage()));
        }  
    }

    private void createGame(Request request) {
        request.verifyValues();
        request.gameId = generateID();
        while(games.containsKey(request.gameId)) request.gameId = generateID();
        games.put(request.gameId, new Game(request.gameId, request.max_timer, request.max_rounds, quotes));
        joinGame(request);
    }

    private void joinGame(Request request) {
        Game game = games.get(request.gameId);
        try {
            if(game == null) throw new GameException("No game with code \"" + request.gameId +"\" exists!");
            game.addPlayer(request.conn, request.name); 
            sendResponse(request.conn, new Response(request));

        } catch (GameException e) {
            sendResponse(request.conn, new Response(e.getMessage()));
        }
    }

    private void leaveGame(Request request){
        Game game = games.get(request.gameId);
        try {
            game.removePlayer(request.name);
            sendResponse(request.conn, new Response());
        } catch (GameException e) {
            sendResponse(request.conn, new Response(e.getMessage()));
        }
    }

    private void startGame(Request request) {
        Game game = games.get(request.gameId);
        try {
            game.startGame();
        } catch(GameException e) {
            sendResponse(request.conn, new Response(e.getMessage()));
        }
    }
    
    private void selectQuote(Request request) {
        Game game = games.get(request.gameId);
        try{
            game.selectQuote(request.name, request.quote);
        } catch(GameException e) {
            sendResponse(request.conn, new Response(e.getMessage()));
        }
    }

    private void submitQuote(Request request) {
        Game game = games.get(request.gameId);
        game.submitQuote(request.name, request.quote);
    }

    private void vote(Request request) {
        Game game = games.get(request.gameId);
        game.voteQuote(request.name, request.quote);
    }

    private void giveBonusPoints(Request request) {
        Game game = games.get(request.gameId);
        try {
            game.giveBonus(request.name, request.quote);
        } catch(GameException e) {
            sendResponse(request.conn, new Response(e.getMessage()));
        }
    }

    private void nextRound(Request request) {
        Game game = games.get(request.gameId);
        game.startRound();
    }

    private static String generateID() {
        int leftLimit = '0';
        int rightLimit = 'Z';
        int targetStringLength = 6;
        Random random = new Random();
    
        String generatedString = random.ints(leftLimit, rightLimit + 1)
        .filter(i -> (i <= '9' || i >= 'A'))
        .limit(targetStringLength)
        .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
        .toString();
    
        return generatedString;
    }

}