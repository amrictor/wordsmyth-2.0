package game;

import java.util.Random;

import com.google.gson.Gson;

import org.java_websocket.WebSocket;

public class Player implements Comparable {
    private transient WebSocket connection;
    
    private String name;
    private short score;
    private String color;
    private boolean judge;
    
    final private transient boolean first;
    private transient Quote quote;
    private transient Quote vote;

    public Player(WebSocket conn, String name) {
        this.first = false;
        this.name = name;
        this.connection = conn;
        this.score = 0;
        Random random = new Random();
        this.color = String.format("#%06x", random.nextInt(256*256*256));
    }

    public Player(WebSocket conn, String name, boolean first, String color){  
        this.first = first;
        this.name = name;
        this.connection = conn;
        this.score = 0;
        this.color = color;
        //String.format("#%06x", random.nextInt(256*256*256));
    }

    public void reset() {
        this.quote = null;
        this.vote = null;
        this.judge = false;
    }

    public boolean hasVote() {
        return this.vote != null;
    }

    public Quote getVote() {
        return this.vote;
    }

    public void vote(Quote quote) {
        this.vote = quote;
    }
    
    public boolean isJudge() {
        return this.judge;
    }

    public boolean isFirst() {
        return this.first;
    }
    
    public void setJudge(boolean judge) {
        this.judge = judge;
    }

    public String toString() {
    	return this.name;
    }

    public boolean equals(Object o) {
        if (o == this) { 
            return true; 
        } 
        if (!(o instanceof Player)) { 
            return false; 
        } 
        Player p = (Player) o;
        return this.name.equals(p.name)
            && this.score == p.score;

    }

    public void sendObject(Object obj) {
        
        Gson gson = new Gson();
        String json = gson.toJson(obj);
        if(!(obj instanceof Time)) {
          System.out.printf("Sending %s to %s\n", json, this.name);  
        }
        try {
            this.connection.send(json);
        } catch (Exception e) {
            System.out.printf("Unable to reach %s\n", this.name);
            e.printStackTrace();
        }
    }

    public boolean isOnline() {
        return this.connection.isOpen();
    }

	public void setConnection(WebSocket conn) {
        this.connection = conn;
    }

	public void setQuote(Quote quote) {
        this.quote = quote;
        this.quote.setPlayer(this);
    }
    
    public Quote getQuote() {
        return this.quote;
    }
    
    public boolean hasQuote() {
        return (this.quote != null);
	}

	public void awardPoints(int i) {
        this.score += i;
	}

    @Override
    public int compareTo(Object o) {
        if (!(o instanceof Player)) { 
            return -1; 
        } 
        Player comparePlayer = (Player) o;
        return comparePlayer.score - this.score;
    }

    
}
	