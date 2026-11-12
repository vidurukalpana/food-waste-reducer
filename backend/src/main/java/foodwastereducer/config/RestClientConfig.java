package foodwastereducer.config;

import java.net.http.HttpClient;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

  private static final Duration TIMEOUT = Duration.ofSeconds(5);

  // Not created in the dev profile. LoggingEmailSender needs no API key.
  @Bean
  @Profile("!dev")
  public RestClient brevoRestClient(
      @Value("${app.brevo.base-url}") String baseUrl,
      @Value("${app.brevo.api-key}") String apiKey) {
    return RestClient.builder()
        .baseUrl(baseUrl)
        .requestFactory(requestFactory())
        .defaultHeader("api-key", apiKey)
        .defaultHeader("Accept", MediaType.APPLICATION_JSON_VALUE)
        .build();
  }

  private static JdkClientHttpRequestFactory requestFactory() {
    HttpClient httpClient = HttpClient.newBuilder().connectTimeout(TIMEOUT).build();
    JdkClientHttpRequestFactory factory = new JdkClientHttpRequestFactory(httpClient);
    factory.setReadTimeout(TIMEOUT);
    return factory;
  }
}
