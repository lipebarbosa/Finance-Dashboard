package me.felipebarbosa.finance.service;

import java.util.List;
import me.felipebarbosa.finance.client.CoinGeckoClient;
import me.felipebarbosa.finance.model.Asset;
import me.felipebarbosa.finance.repository.AssetRepository;
import me.felipebarbosa.finance.repository.PriceHistoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.context.ActiveProfiles;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ActiveProfiles("test")
class PriceServiceTest {

    @Mock
    private PriceHistoryRepository historyRepository;

    @Mock
    private CoinGeckoClient client;

    @Mock
    private AssetRepository repository;

    @Mock
    private me.felipebarbosa.finance.websocket.PriceUpdateHandler priceUpdateHandler;

    @Mock
    private me.felipebarbosa.finance.analysis.FinancialMetricsService metricsService;

    @InjectMocks
    private PriceService priceService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testUpdatePrice_savesUpdatedAsset() throws InterruptedException {
    // 1. Criamos o asset e pegamos o tempo EXATO de agora
    Asset asset = Asset.builder()
            .id(1L)
            .symbol("BTC")
            .name("Bitcoin")
            .currentPrice(BigDecimal.valueOf(30000))
            .lastUpdated(LocalDateTime.now())
            .priceHistory(List.of())
            .build();
    LocalDateTime tempoAntesDaAtualizacao = asset.getLastUpdated();

    // 2. Forçamos uma espera mínima (apenas 10ms) para o relógio avançar
    Thread.sleep(10);

    when(client.getPrice("BTC")).thenReturn(BigDecimal.valueOf(32000));
    when(repository.save(any(Asset.class))).thenAnswer(i -> i.getArgument(0));

    // 3. Executa a lógica
    priceService.updatePrice(asset);

    // 4. Captura o que foi salvo
    ArgumentCaptor<Asset> captor = ArgumentCaptor.forClass(Asset.class);
    verify(repository).save(captor.capture());
    Asset saved = captor.getValue();

    // 5. Validações
    assertEquals(BigDecimal.valueOf(32000), saved.getCurrentPrice());
    assertNotNull(saved.getLastUpdated());
    
    // Compara com o 'tempoAntesDaAtualizacao' que guardamos no passo 1
    assertTrue(saved.getLastUpdated().isAfter(tempoAntesDaAtualizacao), 
        "O tempo de atualização (" + saved.getLastUpdated() + ") deve ser maior que o tempo inicial (" + tempoAntesDaAtualizacao + ")");
    }
}
