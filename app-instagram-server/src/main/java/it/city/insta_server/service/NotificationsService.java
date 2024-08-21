package it.city.insta_server.service;

import it.city.insta_server.entity.Notifications;
import it.city.insta_server.entity.Post;
import it.city.insta_server.entity.User;
import it.city.insta_server.payload.ApiResponse;
import it.city.insta_server.payload.ResNotification;
import it.city.insta_server.repository.NotificationsRepository;
import it.city.insta_server.repository.PostRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor

public class NotificationsService {
    private final NotificationsRepository notificationsRepository;
    private final PostRepository postRepository;

    public ApiResponse getAllNotifications(User user) {
        List<ResNotification> notif = new ArrayList<>();
        for (Notifications notifications : notificationsRepository.findAllByReceiver(user).orElseThrow()) {
            ResNotification resNotification = new ResNotification();
            resNotification.setId(notifications.getId());
            resNotification.setUserSender(notifications.getSender().getUsername());
            resNotification.setPostId(notifications.getPost().getId());
            resNotification.setTimeStep(notifications.getTimestamp());
            notif.add(resNotification);
        }
        return new ApiResponse(true, notif);
    }


    @Transactional
    public ApiResponse bildirishNoma(Long id, User user) {
        List<Notifications> notificationByPostAndUser = notificationsRepository.findAllByPostIdAndSender(id, user).orElseThrow();
        for (Notifications notifications : notificationByPostAndUser) {
            if (Objects.equals(notifications.getPost().getId(), id) &&notifications.getSender()==user) {
                Timestamp time = new Timestamp(System.currentTimeMillis());
                notifications.setTimestamp(time);
                notificationsRepository.save(notifications);
            }
        }
        Notifications notifications = new Notifications();
        notifications.setSender(user);
        Timestamp time = new Timestamp(System.currentTimeMillis());
        notifications.setTimestamp(time);
        Post post = postRepository.findById(id).orElseThrow(() -> new ResourceAccessException("getPost"));
        notifications.setReceiver(post.getUser());
        notifications.setPost(post);
        notificationsRepository.save(notifications);
        return new ApiResponse(true,"massage");
    }
    public ApiResponse deleteNotif(Long postId,String username){
        List<Notifications> notifications = notificationsRepository.findAllByPostIdAndSenderUsername(postId, username).orElseThrow();
        for (Notifications notification : notifications) {
            if (notification.getSender().getUsername().equals(username)&&notification.getPost().getId()==postId){
                notificationsRepository.deleteById(notification.getId());
            }
        }
        return new ApiResponse(true,"success");
    }

    public ApiResponse deleteNotification(Long id) {
        notificationsRepository.deleteById(id);
        return new ApiResponse(true,"success");
    }
}