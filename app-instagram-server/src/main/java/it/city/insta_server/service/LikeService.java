package it.city.insta_server.service;

import it.city.insta_server.entity.Like;
import it.city.insta_server.entity.Post;
import it.city.insta_server.entity.User;
import it.city.insta_server.payload.ApiResponse;
import it.city.insta_server.payload.ResLike;
import it.city.insta_server.repository.LikeRepository;
import it.city.insta_server.repository.PostRepository;
import it.city.insta_server.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public void likePost(Long postId, String username) {
        Post post = postRepository.findById(postId).orElseThrow();
        User user = userRepository.findByUsername(username).orElseThrow();
        if (post.getLikes().size() != 0) {
            for (int i = 0; i < post.getLikes().size(); i++) {
                if (!post.getLikes().get(i).getUser().getUsername().equals(username)) {
                    Like like = new Like();
                    like.setPost(post);
                    like.setUser(user);
                    Like save = likeRepository.save(like);
                    post.getLikes().add(save);
                    postRepository.save(post);
                    return;
                } else {
                    post.getLikes().remove(likeRepository.findByPostIdAndUser(postId, user));
                    postRepository.save(post);
                    likeRepository.deleteByPostIdAndUserId(post.getId(), user.getId());
                    return;
                }
            }
        } else {
            Like like = new Like();
            like.setPost(post);
            like.setUser(user);
            Like save = likeRepository.save(like);
            post.getLikes().add(save);
            postRepository.save(post);
        }
    }

    @Transactional
    public ApiResponse checkLike(Long postId, String username) {
        Post post = postRepository.findById(postId).orElseThrow();
        ResLike resLike = new ResLike();
        resLike.setLikeCount((long) post.getLikes().size());
        resLike.setLikedByCurrenUser(false);
        for (Like like : post.getLikes()) {
            if (like.getUser().getUsername().equals(username)){
                resLike.setLikedByCurrenUser(true);
            }
        }
        return new ApiResponse(true,resLike);
    }
}