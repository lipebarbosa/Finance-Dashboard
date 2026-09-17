package me.felipebarbosa.finance.repository;

import me.felipebarbosa.finance.model.Asset;
import me.felipebarbosa.finance.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for {@link Asset} entities.
 */
@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {

    /**
     * Find an asset by its ticker symbol.
     *
     * @param symbol ticker symbol, e.g., "AAPL" or "BTC"
     * @return optional containing the asset if found
     */
    Optional<Asset> findBySymbol(String symbol);

    /**
     * Find all assets owned by a given username.
     */
    List<Asset> findAllByUser_Username(String username);

    /**
     * Find an asset by symbol belonging to a given user.
     */
    Optional<Asset> findBySymbolAndUser_Username(String symbol, String username);

    /**
     * Find an asset by id belonging to a given user.
     */
    Optional<Asset> findByIdAndUser_Username(Long id, String username);
}
  