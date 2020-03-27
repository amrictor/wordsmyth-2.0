package game;

import server.GameException;
import server.status.GameStatus;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Random;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.Charset;

import org.java_websocket.WebSocket;

import info.bluefoot.scripts.util.circulariterator.CircularIterator;
import info.bluefoot.scripts.util.circulariterator.CircularList;

public class Game {

    private String id;
    private HashMap<String, Player> players;
    private CircularIterator<Player> playerOrder;
    private Iterator<String> colorIterator;
    private String gameColor;
    
    private short round = -1;
    private short phase = -1;

    private Quote[] allQuotes;

    GameStatus status;
    

    public Game(String id) {
        this.id = id;
        this.players = new HashMap<String, Player>();
        String[] color_arr = new String[]{"#ff417d", "#691749", "#d46453", "#ff7a7d", "#ff417d", "#94007a", "#42004e", "#ed7b39", "#ffb84a", "#77b02a", "#429058", "#2c645e", "#032769", "#144491", "#488bd4", "#78d7ff", "#928fb8", "#5b537d", "#10908e", "#28c074", "#cf968c", "#9b0e3e", "#d41e3c", "#691b22"};
        List<String> colors = Arrays.asList(color_arr);
        Collections.shuffle(colors);
        colorIterator = colors.iterator();
        gameColor = colorIterator.next();

        readFile("sourceQuotes.txt");
        System.out.printf("New game created with id %s.\n", this.id);
    }

    public void updateConnection(String playerName, WebSocket conn) throws GameException {
        Player player = this.players.get(playerName);
        if(player == null) {
            throw new GameException("Player does not exist!");
        }
        player.setConnection(conn);
    }
    
    public void updatePlayer(String playerName) throws GameException {
        Player player = this.players.get(playerName);
        if(player == null) {
            throw new GameException("Player does not exist!");
        }
        updatePlayer(player);
    }

    private void updatePlayer(Player player) {
        GameStatus update = new GameStatus(this.status, phase, player);
        // GameStatus update = (this.judge == player) ? this.status : new GameStatus(this.status);
        player.sendObject(update);
        
    }

    private void broadcastGameToAllPlayers() {
        for (Player player : players.values()) {
            updatePlayer(player);
        }
    }

    private void printPlayers() {
        System.out.printf("\nPlayers in Game %s:\n\n", this.id);
        System.out.println(players.entrySet());
    }

    public void addPlayer(WebSocket conn, String playerName) throws GameException {
        if(this.phase > -1) throw new GameException("Game in progress!");
        if(this.players.containsKey(playerName)) throw new GameException("Duplicate player name!");

        this.players.put(playerName, new Player(conn, playerName, this.players.size()==0, colorIterator.next()));
        this.status = new GameStatus(id, players.values().toArray(new Player[players.size()]), gameColor);
        broadcastGameToAllPlayers();
        printPlayers();
    }

    public void removePlayer(String playerName) throws GameException{
        if(this.phase > -1) throw new GameException("Game in progress!");
        players.remove(playerName);
        this.status = new GameStatus(id, players.values().toArray(new Player[players.size()]), gameColor);
        broadcastGameToAllPlayers();
        System.out.printf("Removed %s from game %s\n", playerName, this.id);
    }

    public void startGame() {
        this.playerOrder = new CircularList<Player>(new ArrayList<Player>(players.values())).iterator();
        this.round = 0;
        startRound();
    }

    public void startRound() {
        this.round++;
        this.phase = 0;
        for(Player p : this.players.values()) {
            p.reset();
        }
        playerOrder.next().setJudge(true);
        this.status.setQuotes(getQuoteSelection());
        broadcastGameToAllPlayers();
    }

    public void selectQuote(String playerName, Quote quote) throws GameException {
        Player judge = this.players.get(playerName);
        
        if(!judge.isJudge()) throw new GameException("This player is not the judge and cannot submit a quote!");
                
        Quote[] choice = {quote};
        this.status.setQuotes(choice);
        judge.setQuote(quote);
        this.phase = 1;
        broadcastGameToAllPlayers();
    }

    public void submitQuote(String playerName, Quote quote) {
        Player player = players.get(playerName);
        player.setQuote(quote);
        updatePlayer(player);
       
        for(Player p : players.values()) {
            System.out.printf("%s: %s\n", p, p.getQuote());
            if (!p.hasQuote()) return;
        }
        this.status.setPlayerQuotes();
        this.phase = 2;
        broadcastGameToAllPlayers();
    }

    public void voteQuote(String playerName, Quote quote) {
        Player player = players.get(playerName);
        player.vote(quote);
        updatePlayer(player);

        for(Player p : players.values()) {
            if (!p.hasVote() && !p.isJudge()) return;
        }
        this.status.countVotes();
        this.phase = 3;

        broadcastGameToAllPlayers();
    }

    private Quote[] getQuoteSelection() {
        Random random = new Random();
        Quote[] quoteChoices = new Quote[3];
        for(int i = 0; i<quoteChoices.length; i++) {
            int index = random.nextInt(allQuotes.length);
            while(allQuotes[index].used) {
                System.out.println("Can't use \"" + allQuotes[index].beginning+" "+ allQuotes[index].end + "\"");
                index = random.nextInt(allQuotes.length);
            }
            quoteChoices[i] = allQuotes[index];
            allQuotes[index].used = true;
        }
        return quoteChoices;
    }

    public void readFile(String filename) {        
        try {
            BufferedReader bufferedReader = new BufferedReader(
                    new InputStreamReader(getClass().getClassLoader().getResourceAsStream(filename),
                            Charset.defaultCharset()));
            int numQuotes = Integer.parseInt(bufferedReader.readLine());
            this.allQuotes = new Quote[numQuotes];
            for (int i = 0; i < numQuotes; i++) {
                this.allQuotes[i]=  new Quote(bufferedReader.readLine(), bufferedReader.readLine(), bufferedReader.readLine());
            }
        } catch (Exception e) {
            System.out.println(e.getStackTrace());
        }
        System.out.println("Read in quotes:");
        for(Quote quote : allQuotes) {
            System.out.println(quote);
        }
    }

	public void giveBonus(String name, Quote quote) throws GameException {
        Player player = this.players.get(name);
        if(player == null) {
            throw new GameException("Player does not exist!");
        }
        if(!player.isJudge()) {
            throw new GameException("Player is not the judge and cannot give out bonus points!");
        }

        for(Player p: this.players.values()) {
            Quote playerQuote = p.getQuote();
            if (quote.equals(playerQuote)) {
                playerQuote.toggleBonusPoint();
            }
        }
        updatePlayer(player);
	}
}