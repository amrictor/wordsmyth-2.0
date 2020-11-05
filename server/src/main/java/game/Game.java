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
import java.util.Timer;
import java.util.TimerTask;

import org.java_websocket.WebSocket;

import info.bluefoot.scripts.util.circulariterator.CircularIterator;
import info.bluefoot.scripts.util.circulariterator.CircularList;

public class Game {

    final short MAX_TIMER;
    final short MAX_ROUNDS;

    private String id;
    private HashMap<String, Player> players;
    private CircularIterator<Player> playerOrder;
    private Iterator<String> colorIterator;
    private String gameColor;

    private Timer timer = new Timer();
    private TimerTask task;
    private short time;
    
    // private short round = -1;
    // private short phase = -1;

    private Quote[] allQuotes;
    private boolean[] usedQuotes; 

    GameStatus status;

    // public Game(String id) {
    //     this(id, (short)60, (short)3);
    // }
    public Game(String id, short timer, short rounds, Quote[] quotes) {
        this.id = id;
        this.MAX_TIMER = timer;
        this.MAX_ROUNDS = rounds;
        this.players = new HashMap<String, Player>();
        String[] color_arr = new String[]{"#ff417d", "#691749", "#d46453", "#ff7a7d", "#ff417d", "#94007a", "#42004e", "#ed7b39", "#ffb84a", "#77b02a", "#429058", "#2c645e", "#032769", "#144491", "#488bd4", "#78d7ff", "#928fb8", "#5b537d", "#10908e", "#28c074", "#cf968c", "#9b0e3e", "#d41e3c", "#691b22"};
        List<String> colors = Arrays.asList(color_arr);
        Collections.shuffle(colors);
        colorIterator = colors.iterator();
        gameColor = colorIterator.next();
        allQuotes = quotes;
        usedQuotes = new boolean[quotes.length];
        System.out.printf("New game created with id %s. There will be %d rounds with a timer starting at %d.\n", this.id, this.MAX_ROUNDS, this.MAX_TIMER);
    }

    public String getId() {
        return this.id;
    }

    public boolean checkConnections() {
        for (Player player : players.values()) {
            if(player.isOnline()) return true;
        }
        return false;
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
        GameStatus update = new GameStatus(this.status, player);
        player.sendObject(update); 
    }

    private void broadcastGameToAllPlayers() {
        for (Player player : players.values()) {
            updatePlayer(player);
        }
    }

    private void broadcastTime() {
        for (Player player : players.values()) {
            player.sendObject(new Time(this.time, this.MAX_TIMER));
        }
    }
    
    public void quitGame() {
        for (Player player : players.values()) {
            player.sendObject(new Quit());
        }
	}

    private void printPlayers() {
        System.out.printf("\nPlayers in Game %s:\n\n", this.id);
        System.out.println(players.entrySet());
    }

    public void addPlayer(WebSocket conn, String playerName) throws GameException {
        if(status != null && status.getPhase() > -1) throw new GameException("Game in progress!");
        if(this.players.containsKey(playerName)) throw new GameException("Duplicate player name!");

        this.players.put(playerName, new Player(conn, playerName, this.players.size()==0, colorIterator.next()));
        this.status = new GameStatus(id, players.values().toArray(new Player[players.size()]), gameColor);
        broadcastGameToAllPlayers();
        printPlayers();
    }

    public void removePlayer(String playerName) throws GameException{
        if(status.getPhase() > -1) throw new GameException("Game in progress!");
        players.remove(playerName);
        this.status = new GameStatus(id, players.values().toArray(new Player[players.size()]), gameColor);
        broadcastGameToAllPlayers();
        System.out.printf("Removed %s from game %s\n", playerName, this.id);
    }

    public void startGame() {
        this.playerOrder = new CircularList<Player>(new ArrayList<Player>(players.values())).iterator();
        startRound();
    }

    public void startRound() {
        if(this.status.getRound()>=MAX_ROUNDS) {
            endGame();
            return;
        }
        this.status.nextRound();        
        this.status.setPhase(0);
        // System.out.printf("Starting round %d in phase %d\n", this.status.getRound(), this.status.getPhase());
        for(Player p : this.players.values()) {
            p.reset();
        }
        playerOrder.next().setJudge(true);
        this.status.setQuotes(getQuoteSelection());
        timer();
        broadcastGameToAllPlayers();
    }

    public void endGame() {
        this.status.setPhase(4);
        broadcastGameToAllPlayers();
    }

    public void selectQuote(String playerName, Quote quote) throws GameException {
        Player judge = this.players.get(playerName);
        
        if(!judge.isJudge()) throw new GameException("This player is not the judge and cannot submit a quote!");
                
        Quote[] choice = {quote};
        this.status.setQuotes(choice);
        judge.setQuote(quote);
        this.status.setPhase(1);
        timer();
        broadcastGameToAllPlayers();
    }

    public void submitQuote(String playerName, Quote quote) {
        Player player = players.get(playerName);
        if(quote != null) {
            player.setQuote(quote);
            updatePlayer(player);
        }
        for(Player p : players.values()) {
            System.out.printf("%s: %s\n", p, p.getQuote());
            if (!p.hasQuote() && time>0) return;
        }
        this.status.setPlayerQuotes();
        this.status.setPhase(2);
        timer();
        broadcastGameToAllPlayers();
    }

    public void voteQuote(String playerName, Quote quote) {
        Player player = players.get(playerName);
        if(quote != null) {
            player.vote(quote);
            updatePlayer(player);
        }
        for(Player p : players.values()) {
            if (!p.hasVote() && !p.isJudge() && time>0) return;
        }
        this.cancelTimer();
        this.status.countVotes();
        this.status.setPhase(3);
        broadcastGameToAllPlayers();
    }

    private Quote[] getQuoteSelection() {
        Random random = new Random();
        Quote[] quoteChoices = new Quote[3];
        for(int i = 0; i<quoteChoices.length; i++) {
            int index = random.nextInt(allQuotes.length);
            while(usedQuotes[index]) {
                System.out.println("Can't use \"" + allQuotes[index].beginning+" "+ allQuotes[index].end + "\"");
                index = random.nextInt(allQuotes.length);
            }
            quoteChoices[i] = allQuotes[index];
            usedQuotes[index] = true;
        }
        return quoteChoices;
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

    public void timeOut() throws GameException {
        Random r = new Random();
        for (Player p: this.players.values()){
            switch(this.status.getPhase()){
                case 0: 
                    if(p.isJudge()) selectQuote(p.toString(), status.getQuotes()[r.nextInt(3)]);
                    break;
                case 1: 
                    if(!p.isJudge()) submitQuote(p.toString(), null);
                    break;
                case 2: 
                    if(!p.isJudge()) voteQuote(p.toString(), null);
                    break;
            }
        }
    }
    
    public void cancelTimer() {
        if(task!=null) task.cancel();
        this.time = 0;
        broadcastTime();
    }
    public void timer() {      
        cancelTimer();
        time = MAX_TIMER;
        task = new TimerTask()
        {
            public void run()
            {
                time--;
                broadcastTime();
                if(time<=0){
                    try {
                        timeOut();
                    } catch(GameException e) {
                        e.printStackTrace();
                    }
                    this.cancel();
                    return;
                }
            }
        };
        timer.scheduleAtFixedRate(
            task,
            0,      // run first occurrence immediately
            1100);  // run every second
    }

	
    
}