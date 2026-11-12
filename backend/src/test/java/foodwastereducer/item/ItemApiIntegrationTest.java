package foodwastereducer.item;

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import foodwastereducer.IntegrationTest;
import java.time.Clock;
import java.time.LocalDate;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@IntegrationTest
class ItemApiIntegrationTest {

  @Autowired private MockMvc mockMvc;
  @Autowired private Clock clock;

  @Test
  void registeredUserSeesNewItemInUseSoon() throws Exception {
    String token = registerAndLogin();
    String tomorrow = LocalDate.now(clock).plusDays(1).toString();

    mockMvc
        .perform(
            post("/api/items")
                .header(HttpHeaders.AUTHORIZATION, token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(itemJson("Milk", tomorrow)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.expiryStatus").value("URGENT"))
        .andExpect(jsonPath("$.daysLeft").value(1));

    mockMvc
        .perform(get("/api/items/use-soon").header(HttpHeaders.AUTHORIZATION, token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[*].name").value(hasItem("Milk")));
  }

  @Test
  void anotherUsersItemIsNotFound() throws Exception {
    String owner = registerAndLogin();
    String stranger = registerAndLogin();
    String itemId = createItem(owner, "Cheese", LocalDate.now(clock).plusDays(5).toString());

    mockMvc
        .perform(get("/api/items/" + itemId).header(HttpHeaders.AUTHORIZATION, stranger))
        .andExpect(status().isNotFound())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
        .andExpect(jsonPath("$.detail").value("Item not found"));
  }

  @Test
  void invalidItemReturnsFieldErrors() throws Exception {
    String token = registerAndLogin();
    String invalid =
        """
        {"name": "", "category": "DAIRY", "quantity": 0, "unit": "pcs", "expiryDate": null}
        """;

    mockMvc
        .perform(
            post("/api/items")
                .header(HttpHeaders.AUTHORIZATION, token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalid))
        .andExpect(status().isBadRequest())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
        .andExpect(jsonPath("$.errors.name").exists())
        .andExpect(jsonPath("$.errors.quantity").exists())
        .andExpect(jsonPath("$.errors.expiryDate").exists());
  }

  @Test
  void reminderTriggerWithoutSecretIsRejected() throws Exception {
    mockMvc
        .perform(post("/api/internal/reminders/run"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.detail").value("Invalid cron secret"));
  }

  // Returns the Authorization header value for a new user.
  private String registerAndLogin() throws Exception {
    String credentials =
        """
        {"email": "%s@example.com", "password": "password123"}
        """
            .formatted(UUID.randomUUID());
    mockMvc
        .perform(
            post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(credentials))
        .andExpect(status().isCreated());
    String body =
        mockMvc
            .perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(credentials))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
    return "Bearer " + JsonPath.read(body, "$.token");
  }

  private String createItem(String token, String name, String expiryDate) throws Exception {
    String body =
        mockMvc
            .perform(
                post("/api/items")
                    .header(HttpHeaders.AUTHORIZATION, token)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(itemJson(name, expiryDate)))
            .andExpect(status().isCreated())
            .andReturn()
            .getResponse()
            .getContentAsString();
    return JsonPath.read(body, "$.id");
  }

  private static String itemJson(String name, String expiryDate) {
    return """
        {"name": "%s", "category": "DAIRY", "quantity": 1, "unit": "pcs", "expiryDate": "%s"}
        """
        .formatted(name, expiryDate);
  }
}
