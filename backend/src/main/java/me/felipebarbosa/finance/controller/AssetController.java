package me.felipebarbosa.finance.controller;

import lombok.RequiredArgsConstructor;
import me.felipebarbosa.finance.analysis.FinancialMetricsService;
import me.felipebarbosa.finance.dto.AssetMetricsDTO;
import me.felipebarbosa.finance.dto.AssetRequestDTO;
import me.felipebarbosa.finance.dto.AssetResponseDTO;
import me.felipebarbosa.finance.dto.ChartDataDTO;
import me.felipebarbosa.finance.mapper.ChartDataMapper;
import me.felipebarbosa.finance.service.AssetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/assets")
@RequiredArgsConstructor
@Tag(name = "Ativos", description = "Endpoints para gerenciamento de ativos e métricas do portfólio")
public class AssetController {

    private final AssetService service;
    private final FinancialMetricsService financialMetricsService;

    @PostMapping
    @Operation(summary = "Cadastrar ativo", description = "Cadastra um novo ativo no portfólio de investimentos.")
    public AssetResponseDTO create(@RequestBody AssetRequestDTO dto) {
        return service.create(dto);
    }

    @GetMapping
    @Operation(summary = "Listar ativos", description = "Retorna uma lista com todos os ativos cadastrados.")
    public List<AssetResponseDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}/metrics")
    @Operation(summary = "Métricas do ativo", description = "Retorna as métricas financeiras detalhadas de um ativo específico pelo seu ID.")
    public AssetMetricsDTO getMetrics(@PathVariable("id") Long id) {
        return service.findMetricsById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));
    }

    @GetMapping("/chart/portfolio-last-30-days")
    @Operation(summary = "Gráfico do portfólio", description = "Retorna os dados consolidados do valor do portfólio nos últimos 30 dias.")
    public List<ChartDataDTO> getPortfolioChartLast30Days() {
        var portfolioValueByDate = financialMetricsService.getPortfolioValueLast30Days();
        return ChartDataMapper.mapPortfolioValueToChartData(portfolioValueByDate);
    }
}
