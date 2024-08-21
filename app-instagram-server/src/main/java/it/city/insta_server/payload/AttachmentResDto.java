package it.city.insta_server.payload;

import it.city.insta_server.entity.Attachment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.core.io.Resource;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AttachmentResDto {
    private UUID id;
    private Resource resource;
    private Attachment attachment;
}
