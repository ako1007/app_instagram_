package it.city.insta_server.payload;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResNotification {

    private Long id;
    private String UserSender;
    private Long PostId;
    private Date TimeStep;
    private boolean liked;


}
