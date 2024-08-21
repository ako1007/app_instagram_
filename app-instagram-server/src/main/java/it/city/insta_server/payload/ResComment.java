package it.city.insta_server.payload;

import it.city.insta_server.entity.User;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.Date;

@Getter
@Setter
public class ResComment {
    private Long id;
    private String user;
    private String text;
    private Timestamp timestamp;
    private Long commentId;
    private Long postId;
}
