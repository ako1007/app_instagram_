package it.city.insta_server.payload;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Getter
@Setter
public class ReqPost {
    private UUID fileId;
    private String caption;
    private String tag;
}