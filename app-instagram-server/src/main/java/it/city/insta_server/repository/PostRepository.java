package it.city.insta_server.repository;

import it.city.insta_server.entity.Post;
import it.city.insta_server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByUser(User user);
    Optional<Post> findById(Long id);

//    Post findAllByUserIdAndId(UUID user,Long id);

//    Optional<List<Post>> findByCaptionContaining(String keyword);

    @Query(value = "select * from posts order by id desc ",nativeQuery = true)
    Post [] getPosts();

    List<Post> findByCaptionContaining(String keyword);

    Post findByIdAndUser(Long id, User user);

//    @Query(value = "select * from posts where posts.id=?id and posts.user=?user", nativeQuery = true)
//    Post getOnePost(Long id,User user);
}