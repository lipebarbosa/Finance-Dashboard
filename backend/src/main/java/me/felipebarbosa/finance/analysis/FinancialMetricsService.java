package me.felipebarbosa.finance.analysis;

import lombok.RequiredArgsConstructor;
import me.felipebarbosa.finance.model.Asset;
import me.felipebarbosa.finance.model.PriceHistory;
import me.felipebarbosa.finance.repository.AssetRepository;
import me.felipebarbosa.finance.repository.PriceHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FinancialMetricsService {

    private final AssetRepository assetRepository;
    private final PriceHistoryRepository priceHistoryRepository;

    public BigDecimal getPercentageChange(Long assetId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        PriceHistory firstPrice = priceHistoryRepository
                .findFirstByAssetIdOrderByTimestampAsc(assetId)
                .orElseThrow(() -> new RuntimeException("No price history found"));

        return calculatePercentageChange(firstPrice.getPrice(), asset.getCurrentPrice());
    }

    public BigDecimal calculatePercentageChange(BigDecimal initialPrice, BigDecimal currentPrice) {
        if (initialPrice == null || currentPrice == null || initialPrice.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal difference = currentPrice.subtract(initialPrice);
        return difference
                .divide(initialPrice, java.math.MathContext.DECIMAL64)
                .multiply(BigDecimal.valueOf(100));
    }

    public BigDecimal calculateROI(BigDecimal investment, BigDecimal currentValue) {
        if (investment == null || currentValue == null || investment.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal profit = currentValue.subtract(investment);
        return profit
                .divide(investment, java.math.MathContext.DECIMAL64)
                .multiply(BigDecimal.valueOf(100));
    }

    public BigDecimal getOldestPrice(Long assetId) {
        return priceHistoryRepository
                .findFirstByAssetIdOrderByTimestampAsc(assetId)
                .map(PriceHistory::getPrice)
                .orElse(BigDecimal.ZERO);
    }

    @Transactional(readOnly = true)
    public Map<LocalDate, BigDecimal> getPortfolioValueLast30Days() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<PriceHistory> priceHistory = priceHistoryRepository.findPriceHistoryFromDate(thirtyDaysAgo);

        return priceHistory.stream()
                .collect(Collectors.groupingBy(
                        ph -> ph.getTimestamp().toLocalDate(),
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                PriceHistory::getPrice,
                                BigDecimal::add)));
    }
}
