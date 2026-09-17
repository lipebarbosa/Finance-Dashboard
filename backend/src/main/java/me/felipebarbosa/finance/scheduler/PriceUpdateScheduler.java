package me.felipebarbosa.finance.scheduler;

import lombok.RequiredArgsConstructor;
import me.felipebarbosa.finance.service.PriceService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PriceUpdateScheduler {

    private final PriceService priceService;

    @Scheduled(fixedRate = 60000) // a cada 60s
    public void updatePrices() {
        priceService.updateAllPrices();
    }
}
