package it.city.insta_server.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import it.city.insta_server.config.TwilioProperties;
import it.city.insta_server.payload.ReqSendSms;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SmsService {
    private final TwilioProperties twilioProperties;
    @Autowired
    public SmsService(TwilioProperties twilioProperties) {
        this.twilioProperties = twilioProperties;
    }
    public void sendVerificationCode(ReqSendSms sms) {
        Twilio.init(twilioProperties.getAccountSid(), twilioProperties.getAuthToken());
        Message.creator(new PhoneNumber(sms.getPhoneNumber()),
                        new PhoneNumber(twilioProperties.getTrialNumber()),
                        sms.getMessage())
                .create();

    }
}