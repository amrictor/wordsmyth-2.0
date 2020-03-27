package server;

public class App
{
    public static void main(String[] args) {
        WebsocketServer wss = new WebsocketServer();
        wss.start();
      }
}
