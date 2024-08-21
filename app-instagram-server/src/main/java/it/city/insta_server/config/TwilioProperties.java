package it.city.insta_server.config;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "twilio")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TwilioProperties {
    private String accountSid;
    private String authToken;
    private String trialNumber;
}
