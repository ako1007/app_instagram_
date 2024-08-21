package it.city.insta_server.payload;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqSendSms {
    private String phoneNumber;
    private String message;
}
