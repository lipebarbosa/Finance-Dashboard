package me.felipebarbosa.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO used to receive asset creation or update requests.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetRequestDTO {

    /** Ticker symbol for the asset, e.g. "AAPL" or "BTC". */
    private String symbol;

    /** Human-readable name of the asset. */
    private String name;

    /** Latest known price for the asset. */
    private BigDecimal currentPrice;
}
