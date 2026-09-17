package me.felipebarbosa.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * DTO used to return asset metric data in API responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetMetricsDTO {

    private String symbol;
    private BigDecimal currentPrice;
    private BigDecimal percentageChange;
    private BigDecimal roi;
}
