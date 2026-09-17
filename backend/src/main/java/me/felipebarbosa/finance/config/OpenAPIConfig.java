package me.felipebarbosa.finance.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Finance Dashboard API")
                        .version("1.0.0")
                        .description("API do Dashboard de Finanças para monitoramento de preços de ativos em tempo real.")
                        .contact(new Contact()
                                .name("Felipe Barbosa")
                                .email("felipe@example.com")));
    }
}
