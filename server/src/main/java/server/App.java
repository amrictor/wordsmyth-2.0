package server;

import java.io.File;
import java.io.FileInputStream;
import java.security.KeyStore;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManagerFactory;

import org.java_websocket.server.DefaultSSLWebSocketServerFactory;

public class App
{
    public static void main(String[] args) throws Exception {
        WebsocketServer wss = new WebsocketServer();

        // load up the key store
        String STORETYPE = "JKS";
        String KEYSTORE = "keystore.jks";
        String STOREPASSWORD = "storepassword";
        String KEYPASSWORD = "keypassword";

        KeyStore ks = KeyStore.getInstance( STORETYPE );
        File kf = new File( KEYSTORE );
        ks.load( new FileInputStream( kf ), STOREPASSWORD.toCharArray() );

        KeyManagerFactory kmf = KeyManagerFactory.getInstance( "SunX509" );
        kmf.init( ks, STOREPASSWORD.toCharArray() );
        TrustManagerFactory tmf = TrustManagerFactory.getInstance( "SunX509" );
        tmf.init( ks );

        SSLContext sslContext = null;
        sslContext = SSLContext.getInstance( "TLS" );
        sslContext.init( kmf.getKeyManagers(), tmf.getTrustManagers(), null );

        wss.setWebSocketFactory( new DefaultSSLWebSocketServerFactory( sslContext ) );

        wss.start();
      }
}
