package it.city.insta_server.payload;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ResSearchResult {
    private UUID id;
    private UUID attachmentId;
    private String fullName;
    private String username;
}
