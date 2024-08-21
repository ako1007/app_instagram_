package it.city.insta_server.payload;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class ResUser {
    private String fullName;
    private String username;
    private String email;
    private String phoneNumber;
    private List<ResUser> followers;
    private List<ResUser> following;
    private String website;
    private String bio;
    private String gender;
    //todo List<ResPosts>
    private Integer postcount;
    private UUID attachmentId;
    private boolean isFollowedUser;
}
