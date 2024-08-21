package it.city.insta_server.payload;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ReqComment {
    private String text;
    private Long commentId;
}
