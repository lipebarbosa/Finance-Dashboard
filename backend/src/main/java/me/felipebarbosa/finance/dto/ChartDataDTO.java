package me.felipebarbosa.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for chart data containing portfolio value by date.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChartDataDTO {

    private LocalDate date;
    private BigDecimal portfolioValue;
}
