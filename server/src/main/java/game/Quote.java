package game;

import java.util.ArrayList;

public class Quote {
    String origin;
    String beginning;
    String end;

    ArrayList<Player> votes;
    Player publicPlayer;

    boolean bonus;
    transient boolean used;
    transient Player player;

    public Quote() {};

    public Quote(String origin, String beginning, String end) {
        this.origin = origin;
        this.beginning = beginning;
        this.end = end;
    }

    public boolean hasBonus() {
        return this.bonus;
    }
    
    public void startVoting() {
        this.votes = new ArrayList<Player>();
    }

    public void vote(Player player) {
        this.votes.add(player);
    }

    public void showPlayer() {
        this.publicPlayer = this.player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Player getPlayer() {
        return this.player;
    }

    public ArrayList<Player> getVoters() {
        return this.votes;
    }

    public void toggleBonusPoint() {
        this.bonus = !this.bonus;
    }

    public boolean equals(Object o) {
        if (o == this) { 
            return true; 
        } 
        if (!(o instanceof Quote)) { 
            return false; 
        } 
        Quote quote = (Quote) o;
        return this.origin.equals(quote.origin) 
            && this.beginning.equals(quote.beginning) 
            && this.end.equals(quote.end);
    }
    public String toString() {
        return String.format("There's an old %s saying: \"%s... %s\"", this.origin, this.beginning, this.end);
    }
}