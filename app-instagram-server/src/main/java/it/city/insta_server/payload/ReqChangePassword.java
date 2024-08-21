package it.city.insta_server.payload;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqChangePassword {
    private String oldPassword;
    private String newPassword;
    private String confirmNewPassword;
}
