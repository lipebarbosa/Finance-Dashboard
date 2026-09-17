package me.felipebarbosa.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO used to return asset data in API responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetResponseDTO {

    /** Database identifier for the asset. */
    private Long id;

    /** Ticker symbol for the asset. */
    private String symbol;

    /** Human-readable name of the asset. */
    private String name;

    /** Latest known price for the asset. */
    private BigDecimal currentPrice;

    /** Last time the asset price was updated. */
    private LocalDateTime lastUpdated;
}
