package me.felipebarbosa.finance.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO used for user login.
 */
@Data
public class LoginRequestDTO {
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;
}
