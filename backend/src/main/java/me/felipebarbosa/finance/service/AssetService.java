package me.felipebarbosa.finance.service;

import lombok.RequiredArgsConstructor;
import me.felipebarbosa.finance.analysis.FinancialMetricsService;
import me.felipebarbosa.finance.dto.AssetMetricsDTO;
import me.felipebarbosa.finance.dto.AssetRequestDTO;
import me.felipebarbosa.finance.dto.AssetResponseDTO;
import me.felipebarbosa.finance.mapper.AssetMapper;
import me.felipebarbosa.finance.model.Asset;
import me.felipebarbosa.finance.model.User;
import me.felipebarbosa.finance.repository.AssetRepository;
import me.felipebarbosa.finance.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Business logic for asset CRUD operations, now scoped to the authenticated user.
 */
@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository repository;
    private final UserRepository userRepository;
    private final FinancialMetricsService metricsService;

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private User getCurrentUser() {
        String username = getCurrentUsername();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
    }

    public AssetResponseDTO create(AssetRequestDTO dto) {
        User user = getCurrentUser();
        Asset asset = AssetMapper.toEntity(dto);
        asset.setUser(user);
        Asset saved = repository.save(asset);
        return AssetMapper.toDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<AssetResponseDTO> findAll() {
        String username = getCurrentUsername();
        return repository.findAllByUser_Username(username)
                .stream()
                .map(AssetMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<AssetResponseDTO> findBySymbol(String symbol) {
        String username = getCurrentUsername();
        return repository.findBySymbolAndUser_Username(symbol.toUpperCase(), username)
                .map(AssetMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public Optional<AssetMetricsDTO> findMetricsById(Long id) {
        String username = getCurrentUsername();
        return repository.findByIdAndUser_Username(id, username)
                .map(asset -> {
                    BigDecimal oldestPrice = metricsService.getOldestPrice(asset.getId());
                    BigDecimal percentageChange = metricsService.calculatePercentageChange(oldestPrice, asset.getCurrentPrice());
                    BigDecimal roi = metricsService.calculateROI(oldestPrice, asset.getCurrentPrice());
                    return AssetMetricsDTO.builder()
                            .symbol(asset.getSymbol())
                            .currentPrice(asset.getCurrentPrice())
                            .percentageChange(percentageChange.setScale(2, RoundingMode.HALF_UP))
                            .roi(roi.setScale(2, RoundingMode.HALF_UP))
                            .build();
                });
    }
}
