package it.city.insta_server.repository;

import it.city.insta_server.entity.Notifications;
import it.city.insta_server.entity.Post;
import it.city.insta_server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationsRepository extends JpaRepository<Notifications,Long> {
    Optional<List<Notifications>> findAllByReceiver(User user);
    Optional<List<Notifications>> findAllByPost(Post post);
    Optional<List<Notifications>> findAllByPostIdAndSender(Long post_id, User sender);
    Optional<List<Notifications>>  findAllByPostIdAndSenderUsername(Long post_id, String sender_username);
}
