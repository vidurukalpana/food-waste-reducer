package foodwastereducer.item;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ItemRequest(
    @NotBlank(message = "Name is required")
        @Size(max = 120, message = "Name must be at most 120 characters")
        String name,
    @NotNull(message = "Category is required") Category category,
    // Fits the numeric(10,2) column.
    @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be greater than 0")
        @Digits(
            integer = 8,
            fraction = 2,
            message = "Quantity is too large or has more than 2 decimals")
        BigDecimal quantity,
    @NotBlank(message = "Unit is required")
        @Size(max = 20, message = "Unit must be at most 20 characters")
        String unit,
    @NotNull(message = "Expiry date is required") LocalDate expiryDate,
    @Pattern(regexp = "\\d{8,14}", message = "Barcode must be 8 to 14 digits") String barcode) {}
