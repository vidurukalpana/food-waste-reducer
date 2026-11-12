package foodwastereducer.reminder;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

// Body of POST /v3/smtp/email.
record BrevoEmailRequest(Address sender, List<Address> to, String subject, String htmlContent) {

  @JsonInclude(JsonInclude.Include.NON_NULL)
  record Address(String email, String name) {}
}
