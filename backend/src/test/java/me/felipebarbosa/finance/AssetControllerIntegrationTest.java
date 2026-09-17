package me.felipebarbosa.finance;

import me.felipebarbosa.finance.dto.AssetRequestDTO;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.reactive.server.WebTestClient;

import me.felipebarbosa.finance.repository.UserRepository;
import me.felipebarbosa.finance.config.JwtUtils;
import me.felipebarbosa.finance.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
class AssetControllerIntegrationTest {

    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void shouldCreateAssetViaPostAssets() {
        String username = "testuser_integration";
        if (!userRepository.existsByUsername(username)) {
            User user = User.builder()
                    .username(username)
                    .email("integration@example.com")
                    .password(passwordEncoder.encode("password"))
                    .build();
            userRepository.save(user);
        }
        String token = jwtUtils.generateJwtToken(username);

        var request = new AssetRequestDTO("bitcoin", "Bitcoin", BigDecimal.valueOf(30000));
        webTestClient.post()
                .uri("/assets")
                .header("Authorization", "Bearer " + token)
                .bodyValue(request)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.symbol").isEqualTo("bitcoin")
                .jsonPath("$.name").isEqualTo("Bitcoin");
    }
}
