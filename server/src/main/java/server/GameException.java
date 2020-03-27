package server;

public class GameException extends Exception {

    private static final long serialVersionUID = 1L;

    public GameException() {
        super("This error originated from unacceptable player actions.");
    }
    public GameException(String message) {
        super(message);
    }

}