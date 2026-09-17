package me.felipebarbosa.finance.websocket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceUpdateMessage {

    private String symbol;
    private BigDecimal price;
    private BigDecimal percentageChange;
    private LocalDateTime timestamp;
    private String type; // "PRICE_UPDATE"
}
