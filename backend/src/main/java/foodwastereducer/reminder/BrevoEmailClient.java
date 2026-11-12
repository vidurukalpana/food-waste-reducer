package foodwastereducer.reminder;

import java.util.List;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

// Brevo transactional email API over HTTPS. Render blocks outbound SMTP.
@Component
@Profile("!dev")
public class BrevoEmailClient implements EmailSender {

  private static final String SENDER_NAME = "Food Waste Reducer";

  private final RestClient restClient;
  private final String fromAddress;

  public BrevoEmailClient(
      @Qualifier("brevoRestClient") RestClient restClient,
      @Value("${app.mail.from}") String fromAddress) {
    this.restClient = restClient;
    this.fromAddress = fromAddress;
  }

  @Override
  public void send(String to, String subject, String htmlContent) {
    BrevoEmailRequest request =
        new BrevoEmailRequest(
            new BrevoEmailRequest.Address(fromAddress, SENDER_NAME),
            List.of(new BrevoEmailRequest.Address(to, null)),
            subject,
            htmlContent);
    try {
      restClient
          .post()
          .uri("/smtp/email")
          .contentType(MediaType.APPLICATION_JSON)
          .body(request)
          .retrieve()
          .toBodilessEntity();
    } catch (RestClientResponseException ex) {
      throw new EmailDeliveryException(
          "Brevo rejected the email with status " + ex.getStatusCode().value(), ex);
    } catch (RestClientException ex) {
      throw new EmailDeliveryException("Brevo could not be reached", ex);
    }
  }
}
