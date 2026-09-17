package me.felipebarbosa.finance.repository;

import me.felipebarbosa.finance.model.PriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {

    List<PriceHistory> findByAssetIdOrderByTimestampAsc(Long assetId);

    Optional<PriceHistory> findFirstByAssetIdOrderByTimestampAsc(Long assetId);

    @Query("SELECT ph FROM PriceHistory ph WHERE ph.timestamp >= :startDate ORDER BY ph.timestamp ASC")
    List<PriceHistory> findPriceHistoryFromDate(@Param("startDate") LocalDateTime startDate);
}