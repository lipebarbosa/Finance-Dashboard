package me.felipebarbosa.finance.mapper;

import me.felipebarbosa.finance.dto.AssetRequestDTO;
import me.felipebarbosa.finance.dto.AssetResponseDTO;
import me.felipebarbosa.finance.model.Asset;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Mapper for converting between {@link Asset} entities and asset DTOs.
 */
public final class AssetMapper {

    private AssetMapper() {
        throw new UnsupportedOperationException("Utility class");
    }

    public static AssetResponseDTO toDTO(Asset asset) {
        if (asset == null) {
            return null;
        }
        return AssetResponseDTO.builder()
                .id(asset.getId())
                .symbol(asset.getSymbol())
                .name(asset.getName())
                .currentPrice(asset.getCurrentPrice())
                .lastUpdated(asset.getLastUpdated())
                .build();
    }

    public static Asset toEntity(AssetRequestDTO requestDTO) {
        if (requestDTO == null) {
            return null;
        }
        return Asset.builder()
                .symbol(requestDTO.getSymbol())
                .name(requestDTO.getName())
                .currentPrice(requestDTO.getCurrentPrice())
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    public static Asset updateEntity(AssetRequestDTO requestDTO, Asset asset) {
        if (requestDTO == null || asset == null) {
            return asset;
        }
        if (Objects.nonNull(requestDTO.getSymbol())) {
            asset.setSymbol(requestDTO.getSymbol());
        }
        if (Objects.nonNull(requestDTO.getName())) {
            asset.setName(requestDTO.getName());
        }
        if (Objects.nonNull(requestDTO.getCurrentPrice())) {
            asset.setCurrentPrice(requestDTO.getCurrentPrice());
        }
        asset.setLastUpdated(LocalDateTime.now());
        return asset;
    }
}
