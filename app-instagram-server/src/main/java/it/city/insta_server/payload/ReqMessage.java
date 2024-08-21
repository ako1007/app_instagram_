package it.city.insta_server.payload;

import it.city.insta_server.entity.enums.Status;
import lombok.*;

import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ReqMessage {
    private Long id;
    private String senderName;
    private String receiverName;
    private String message;
    private Timestamp date;
    private Status status;

}