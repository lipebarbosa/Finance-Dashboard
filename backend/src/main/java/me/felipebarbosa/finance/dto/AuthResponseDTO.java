package me.felipebarbosa.finance.dto;

import lombok.Data;

/**
 * DTO returned after successful authentication (login) or registration.
 * Contains the JWT access token and its type.
 */
@Data
public class AuthResponseDTO {
    private String accessToken;
    private String tokenType = "Bearer";

    public AuthResponseDTO(String accessToken) {
        this.accessToken = accessToken;
    }
}
