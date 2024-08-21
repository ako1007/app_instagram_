package it.city.insta_server.payload;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResLike {
    private Long likeCount;
    private boolean isLikedByCurrenUser;
}
