package foodwastereducer.summary;

import foodwastereducer.auth.CurrentUser;
import jakarta.validation.constraints.Pattern;
import java.time.YearMonth;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SummaryController {

  private final SummaryService summaryService;

  public SummaryController(SummaryService summaryService) {
    this.summaryService = summaryService;
  }

  // month defaults to the current month in Sri Lanka.
  @GetMapping("/api/summary")
  public MonthlySummary monthly(
      @AuthenticationPrincipal Jwt jwt,
      @RequestParam(required = false)
          @Pattern(regexp = "\\d{4}-(0[1-9]|1[0-2])", message = "Month must be in YYYY-MM format")
          String month) {
    YearMonth yearMonth = month == null ? summaryService.currentMonth() : YearMonth.parse(month);
    return summaryService.monthly(CurrentUser.id(jwt), yearMonth);
  }
}
