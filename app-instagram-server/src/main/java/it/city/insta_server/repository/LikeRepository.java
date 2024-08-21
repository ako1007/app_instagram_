package it.city.insta_server.repository;

import it.city.insta_server.entity.Like;
import it.city.insta_server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    Like findByPostIdAndUser(Long post_id, User user);
    Optional<List<Like>> findAllByPostId(Long post_id);
    void deleteByPostIdAndUserId(Long postId, UUID userId);
}