package it.city.insta_server.controller;

import it.city.insta_server.entity.User;
import it.city.insta_server.payload.ApiResponse;
import it.city.insta_server.security.CurrentUser;
import it.city.insta_server.service.NotificationsService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationsController {
    private final NotificationsService notificationsService;

    @Autowired
    public NotificationsController(NotificationsService notificationsService) {
        this.notificationsService = notificationsService;
    }

    @Transactional
    @PostMapping("/save/{postId}")
    public ResponseEntity<?> bildirishNoma(@PathVariable Long postId, @CurrentUser User user) {
        return ResponseEntity.ok().body(notificationsService.bildirishNoma(postId,user));
    }

    @GetMapping("/allNotification")
    public ResponseEntity<?> getAllNotifications(@CurrentUser User user) {
        return ResponseEntity.ok().body(notificationsService.getAllNotifications(user));
    }

    @DeleteMapping("/deleteNotification/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
       return ResponseEntity.ok().body(notificationsService.deleteNotification(id));
    }
    @DeleteMapping("/delete/{postId}")
    public ResponseEntity<?> deleteNotif(@PathVariable Long postId, @CurrentUser UserDetails userDetails){
       return ResponseEntity.ok().body(notificationsService.deleteNotif(postId,userDetails.getUsername()));
    }
}

