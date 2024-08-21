package it.city.insta_server.config;

import com.twilio.Twilio;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TwilioInitializer {
    public TwilioInitializer(TwilioProperties twilioConfig) {
        Twilio.init(twilioConfig.getAccountSid(), twilioConfig.getAuthToken());
    }
}