package it.city.insta_server.payload;

import it.city.insta_server.entity.Comment;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
public class ResPost {
    private Long id;
    private String user;
    private String caption;
    private String tag;
    private Date timestamp;
    private UUID attachmentId;
}