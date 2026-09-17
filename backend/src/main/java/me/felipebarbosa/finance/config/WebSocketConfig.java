package me.felipebarbosa.finance.config;

import lombok.RequiredArgsConstructor;
import me.felipebarbosa.finance.websocket.PriceUpdateHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final PriceUpdateHandler priceUpdateHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(priceUpdateHandler, "/ws/prices")
                .setAllowedOrigins("*");
    }
}
