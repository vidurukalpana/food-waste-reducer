package foodwastereducer.reminder;

public interface EmailSender {

  // Throws EmailDeliveryException when the email is not accepted.
  void send(String to, String subject, String htmlContent);
}
