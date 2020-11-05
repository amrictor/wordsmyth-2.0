package server;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.security.KeyStore;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManagerFactory;

import com.google.gson.Gson;

import org.java_websocket.server.DefaultSSLWebSocketServerFactory;

public class App {

    private static Environment readEnvironment() {
      try (FileReader reader = new FileReader("env.json")) {
        Gson gson = new Gson();
        return gson.fromJson(reader, Environment.class);
      } catch(Exception e) {
        e.printStackTrace();
      }
      return null;
    }
    public static void main(String[] args) throws Exception {
      WebsocketServer wss = new WebsocketServer();

      if (readEnvironment().USE_WSS) {
        // load up the key store
        String STORETYPE = "JKS";
        String KEYSTORE = "keystore.jks";
        String STOREPASSWORD = "password";
        String KEYPASSWORD = "password";

        KeyStore ks = KeyStore.getInstance( STORETYPE );
        File kf = new File( KEYSTORE );
        ks.load( new FileInputStream( kf ), STOREPASSWORD.toCharArray() );

        KeyManagerFactory kmf = KeyManagerFactory.getInstance( "SunX509" );
        kmf.init( ks, KEYPASSWORD.toCharArray());
        TrustManagerFactory tmf = TrustManagerFactory.getInstance( "SunX509" );
        tmf.init( ks );

        SSLContext sslContext = null;
        sslContext = SSLContext.getInstance( "TLS" );
        sslContext.init( kmf.getKeyManagers(), tmf.getTrustManagers(), null );

        wss.setWebSocketFactory( new DefaultSSLWebSocketServerFactory( sslContext ) );
      }
      wss.start();
    }
}
