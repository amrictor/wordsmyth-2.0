package server.status;

import java.util.Random;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import com.google.gson.Gson;

import game.Player;
import game.Quote;
import server.Request;

public class GameStatus {

    private String type = "status";
    private short phase;
    private String gameId;
    private String color;
    private Player player;
    private Request expectedRequest;
    private Quote[] quotes;
    private Player[] players;
    private List<Quote> playerQuotes;


    public GameStatus(GameStatus gs, short phase, Player player) {
        this.gameId = gs.gameId;
        this.color = gs.color;
        this.players = gs.players;
        this.player = player;
        this.phase = phase;
        if(phase==-1) { //joining
            if(player.isFirst()) { 
                this.expectedRequest = new Request(gameId, "start");
            } else {
                this.expectedRequest = null;
            }
        }
        else if(phase==0) { //choosing
            if(player.isJudge()) { 
                this.quotes = gs.quotes;
                this.expectedRequest = new Request(gameId, "select");
            } else {
                this.expectedRequest = null;
            }
        }
        else if(phase==1) { //writing
            if(player.isJudge()) {
                this.expectedRequest = null;
            } else {
                this.quotes = gs.quotes;
                if(!player.hasQuote()) this.expectedRequest = new Request(gameId, "submit");
                
            }
        }
        else if(phase==2) { //voting
            this.playerQuotes = new ArrayList<Quote>(gs.playerQuotes);
            this.playerQuotes.remove(player.getQuote());
            if(player.isJudge()) {
                this.expectedRequest = new Request(gameId, "bonus");
            } else {
                if(!player.hasVote()) this.expectedRequest = new Request(gameId, "vote");
            }
        }
        else if(phase==3) { //results
            this.playerQuotes = gs.playerQuotes;
            if(player.isFirst()) {
                this.expectedRequest = new Request(gameId, "continue");
            }
        }
    }

    public GameStatus(String gameId, Player[] players, String color) {
        this.gameId = gameId;
        this.players = players;
        this.color = color;
    }

    public void countVotes() {
        for(Quote q: this.playerQuotes) {
            q.startVoting();
        }
        for(Player p: players) {
            for(Quote q: this.playerQuotes) {
                Quote playerVote = p.getVote();
                if (q.equals(playerVote)) {
                    q.vote(p);
                }
            }
        }
        boolean flag = true;
        for(Quote q: this.playerQuotes) {
            q.showPlayer();
            if(q.getPlayer().isJudge()) { //2 points to players who chose correct quote
                for(Player p: q.getVoters()) {
                    flag = false;
                    p.awardPoints(2);
                    System.out.printf("2 points to %s for voting correctly\n", p);
                }
                if(flag) {
                    q.getPlayer().awardPoints(3); //3 points to judge if no one guesses
                    System.out.printf("3 points to %s for stumping the rest\n", q.getPlayer());
                }
            }
            else {
                q.getPlayer().awardPoints(q.getVoters().size());
                System.out.printf("%d points to %s for votes\n",q.getVoters().size(), q.getPlayer());
            }
            if(q.hasBonus()) q.getPlayer().awardPoints(1);
        }

    }

    public void setQuotes(Quote[] quotes) {
        this.quotes = quotes;
    }

    public void setNextRequest(String action) {
        this.expectedRequest = new Request(gameId, action);
    }

    public String toString() {
        Gson gson = new Gson();
        return gson.toJson(this);
    }

	public void setPlayerQuotes() {
        List<Player> shuffledPlayers = Arrays.asList(this.players);
        Collections.shuffle(shuffledPlayers);
        this.playerQuotes = new ArrayList<Quote>();
        for (Player p : shuffledPlayers) {
            this.playerQuotes.add(p.getQuote());
        }
	} 
    
}