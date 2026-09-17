package me.felipebarbosa.finance.mapper;

import me.felipebarbosa.finance.dto.ChartDataDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Mapper for converting portfolio data to ChartDataDTO.
 */
public final class ChartDataMapper {

    private ChartDataMapper() {
        throw new UnsupportedOperationException("Utility class");
    }

    public static List<ChartDataDTO> mapPortfolioValueToChartData(Map<LocalDate, BigDecimal> portfolioValueByDate) {
        if (portfolioValueByDate == null || portfolioValueByDate.isEmpty()) {
            return List.of();
        }

        return portfolioValueByDate.entrySet()
                .stream()
                .map(entry -> ChartDataDTO.builder()
                        .date(entry.getKey())
                        .portfolioValue(entry.getValue())
                        .build())
                .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
                .collect(Collectors.toList());
    }
}
