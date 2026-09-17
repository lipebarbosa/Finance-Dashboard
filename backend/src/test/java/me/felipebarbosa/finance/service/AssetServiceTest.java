package me.felipebarbosa.finance.service;

import java.util.List;
import me.felipebarbosa.finance.model.Asset;
import me.felipebarbosa.finance.repository.AssetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.context.ActiveProfiles;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ActiveProfiles("test")
class AssetServiceTest {

    @Mock
    private AssetRepository assetRepository;

    @InjectMocks
    private AssetService assetService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("testuser");
        
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void testFindAll_returnsAllAssets() {
        Asset a = Asset.builder()
                .id(1L)
                .symbol("AAPL")
                .name("Apple Inc.")
                .currentPrice(BigDecimal.valueOf(150))
                .lastUpdated(LocalDateTime.now())
                .priceHistory(List.of())
                .build();
        when(assetRepository.findAllByUser_Username("testuser")).thenReturn(Collections.singletonList(a));

        var result = assetService.findAll();

        assertEquals(1, result.size());
        assertEquals("AAPL", result.get(0).getSymbol());
        verify(assetRepository).findAllByUser_Username("testuser");
    }

    @Test
    void testFindBySymbol_found() {
        Asset a = Asset.builder()
                .id(2L)
                .symbol("MSFT")
                .name("Microsoft Corp.")
                .currentPrice(BigDecimal.valueOf(300))
                .lastUpdated(LocalDateTime.now())
                .priceHistory(List.of())
                .build();
        when(assetRepository.findBySymbolAndUser_Username("MSFT", "testuser")).thenReturn(Optional.of(a));

        var opt = assetService.findBySymbol("msft"); // case-insensitive

        assertTrue(opt.isPresent());
        assertEquals("MSFT", opt.get().getSymbol());
        verify(assetRepository).findBySymbolAndUser_Username("MSFT", "testuser");
    }

    @Test
    void testFindBySymbol_notFound() {
        when(assetRepository.findBySymbolAndUser_Username("XYZ", "testuser")).thenReturn(Optional.empty());

        var opt = assetService.findBySymbol("xyz");

        assertTrue(opt.isEmpty());
        verify(assetRepository).findBySymbolAndUser_Username("XYZ", "testuser");
    }
}
