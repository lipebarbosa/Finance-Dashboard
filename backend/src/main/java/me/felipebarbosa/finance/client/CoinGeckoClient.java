package me.felipebarbosa.finance.client;

import lombok.RequiredArgsConstructor;
import me.felipebarbosa.finance.FinanceDashboardApplication;
import me.felipebarbosa.finance.model.Asset;

import org.springframework.boot.SpringApplication;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CoinGeckoClient {

    private final WebClient webClient;

    public BigDecimal getPrice(String symbol) {
        String url = "/simple/price?ids=" + symbol.toLowerCase() + "&vs_currencies=usd";

        Map<String, Map<String, Double>> response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        if (response == null || !response.containsKey(symbol.toLowerCase())) {
            throw new RuntimeException("Erro ao buscar preço para: " + symbol);
        }

        Double price = response.get(symbol.toLowerCase()).get("usd");
        return BigDecimal.valueOf(price);
    }
    public static void main(String[] args) {
    SpringApplication.run(FinanceDashboardApplication.class, args);

    Asset asset = Asset.builder()
            .symbol("BTC")
            .name("Bitcoin")
            .build();

    System.out.println(asset.getSymbol());
    }
}
