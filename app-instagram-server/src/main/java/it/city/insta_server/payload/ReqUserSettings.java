package it.city.insta_server.payload;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ReqUserSettings {
private String fullName;
private String username;
private String websiteUrl;
private String bio;
private String email;
private String phoneNumber;
private String gender;
private UUID   attachmentId;
}
