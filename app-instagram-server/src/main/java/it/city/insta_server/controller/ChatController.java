package it.city.insta_server.controller;
import it.city.insta_server.payload.ReqMessage;
import it.city.insta_server.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.sql.Timestamp;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/message")
public class ChatController {

    private final MessageService messageService;

    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public ReqMessage receiveMessage(@Payload ReqMessage message) {
        Boolean user = messageService.getUser(message);
        if (user) {
            return message;
        } else {
            return null;
        }
    }

    @GetMapping("/{name}/all-chat")
    public HttpEntity<?> getUserAndMessage(@PathVariable String name) {
        return ResponseEntity.ok(messageService.getAllUsersMessage(name));
    }

    @MessageMapping("/private-message")
    @GetMapping("/{username}")
    public ReqMessage recMessage(@Payload ReqMessage message) {
        Boolean aBoolean = messageService.addMessage(message);
        if (aBoolean) {
            simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", message);
            System.out.println(message.toString());
            return message;
        } else {
            return null;
        }
    }

    @PostMapping("/{name}/{username}/get-one")
    public HttpEntity<?> getOne(@PathVariable String name, @PathVariable String username){
        return ResponseEntity.ok(messageService.getOne(name,username));
    }

    @DeleteMapping("/{id}/delete-message")
    public HttpEntity<?> deleteMessage(@PathVariable Long id) {
        messageService.deleteMessage(id);
        return ResponseEntity.ok().build();
    }

}