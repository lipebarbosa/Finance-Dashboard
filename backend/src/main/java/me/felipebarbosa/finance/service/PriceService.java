package me.felipebarbosa.finance.service;

import lombok.RequiredArgsConstructor;
import me.felipebarbosa.finance.client.CoinGeckoClient;
import me.felipebarbosa.finance.model.Asset;
import me.felipebarbosa.finance.model.PriceHistory;
import me.felipebarbosa.finance.repository.AssetRepository;
import me.felipebarbosa.finance.repository.PriceHistoryRepository;
import me.felipebarbosa.finance.websocket.PriceUpdateHandler;
import me.felipebarbosa.finance.websocket.PriceUpdateMessage;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PriceService {

    private final CoinGeckoClient client;
    private final AssetRepository repository;
    private final PriceHistoryRepository historyRepository;
    private final PriceUpdateHandler priceUpdateHandler;

    public void updatePrice(Asset asset) {
        BigDecimal oldPrice = asset.getCurrentPrice();
        BigDecimal newPrice = client.getPrice(asset.getSymbol());

        asset.setCurrentPrice(newPrice);
        asset.setLastUpdated(LocalDateTime.now());

        repository.save(asset);

        // SALVAR HISTÓRICO
        PriceHistory history = PriceHistory.builder()
                .asset(asset)
                .price(newPrice)
                .timestamp(LocalDateTime.now())
                .build();

        historyRepository.save(history);

        // EMITIR VIA WEBSOCKET
        BigDecimal percentageChange = calculatePercentageChange(oldPrice, newPrice);
        PriceUpdateMessage message = PriceUpdateMessage.builder()
                .symbol(asset.getSymbol())
                .price(newPrice)
                .percentageChange(percentageChange)
                .timestamp(LocalDateTime.now())
                .type("PRICE_UPDATE")
                .build();

        priceUpdateHandler.broadcastPriceUpdate(message);
    }

    private BigDecimal calculatePercentageChange(BigDecimal oldPrice, BigDecimal newPrice) {
        if (oldPrice == null || oldPrice.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        BigDecimal difference = newPrice.subtract(oldPrice);
        return difference
                .divide(oldPrice, java.math.MathContext.DECIMAL64)
                .multiply(BigDecimal.valueOf(100));
    }

    public void updateAllPrices() {
        var assets = repository.findAll();

        for (Asset asset : assets) {
            updatePrice(asset);
        }
    }
}
