package it.city.insta_server.repository;

import it.city.insta_server.entity.Comment;
import it.city.insta_server.entity.Notifications;
import it.city.insta_server.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment,Long> {
    List<Comment> findAllByPostId(Long post_id);
    List <Comment> findAllByPostIdAndCommentId(Long post_id,Long comment_id);
    boolean deleteAllByCommentId(Long comment_id);

    Optional<List<Comment>> findAllByPost(Post post);

}
