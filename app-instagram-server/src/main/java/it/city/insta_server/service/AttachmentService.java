package it.city.insta_server.service;

import it.city.insta_server.entity.Attachment;
import it.city.insta_server.payload.AttachmentResDto;
import it.city.insta_server.repository.AttachmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    public static final Path root = Paths.get("C:\\Backtogram_images");
    private final AttachmentRepository attachmentRepository;

    public UUID upload(MultipartFile multipartFile) throws IOException {
        if (!Files.exists(root)) {
            Files.createDirectory(root);
            Files.setAttribute(root, "dos:hidden", true);
        }
        String uniqueFilename = UUID.randomUUID() + "_" + multipartFile.getOriginalFilename();
        Files.copy(multipartFile.getInputStream(), root.resolve(uniqueFilename));
        return attachmentRepository.save(new Attachment(
                uniqueFilename,
                multipartFile.getContentType(),
                multipartFile.getSize()
        )).getId();
    }


    public AttachmentResDto getFile(UUID id) throws MalformedURLException {
        Attachment attachment = attachmentRepository.findById(id).orElseThrow(() -> new ResourceAccessException("GetAttachment"));
        Path file = root.resolve(attachment.getName());
        Resource resource = new UrlResource(file.toUri());
        return new AttachmentResDto(
                attachment.getId(),
                resource,
                attachment
        );
    }
}
