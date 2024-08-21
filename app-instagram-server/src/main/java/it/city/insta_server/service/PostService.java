package it.city.insta_server.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import it.city.insta_server.entity.*;
import it.city.insta_server.payload.ApiResponse;
import it.city.insta_server.payload.ReqPost;
import it.city.insta_server.payload.ResPost;
import it.city.insta_server.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Service
@JsonIgnoreProperties(ignoreUnknown = true)
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final AttachmentRepository attachmentRepository;
    private final UserRepository userRepository;
    private final NotificationsRepository notificationsRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

    public ApiResponse getPostsWithUser(String username, String currentUser) {
        List<ResPost> resPosts = new ArrayList<>();
        User user = userRepository.findByUsername(username).orElseThrow();
        for (Post post : postRepository.findAllByUser(user)) {
            ResPost resPost = new ResPost();
            setPost(resPost, post);
            resPosts.add(resPost);
        }
        return new ApiResponse(true, resPosts);
    }

    public void setPost(ResPost resPost, Post post) {
        resPost.setId(post.getId());
        resPost.setTag(post.getTag());
        resPost.setCaption(post.getCaption());
        resPost.setUser(post.getUser().getUsername());
        resPost.setTimestamp(post.getCreatedTime());
        resPost.setAttachmentId(post.getAttachment().getId());
    }

    public ApiResponse getOne(Long id, String currentUser) {
        Post post = postRepository.findById(id).orElseThrow();
        ResPost resPost = new ResPost();
        setPost(resPost, post);
        return new ApiResponse(true, resPost);
    }

    @Transactional
    public ApiResponse addPost(String username, ReqPost reqPost) {
        Post post = new Post();
        User user = userRepository.findByUsername(username).orElseThrow();
        post.setUser(user);
        post.setCaption(reqPost.getCaption());
        post.setTag(reqPost.getTag());
        post.setAttachment(attachmentRepository.findById(reqPost.getFileId()).orElseThrow());
        Timestamp time = new Timestamp(System.currentTimeMillis());
        post.setCreatedTime(time);
        postRepository.save(post);
        return new ApiResponse("Successfully saved post", true);
    }

    @Transactional
    public void deletePost(Long id, String username) {
        Post post = postRepository.findById(id).orElseThrow();
        for (Notifications notifications : notificationsRepository.findAllByPost(post).orElseThrow()) {
            notificationsRepository.deleteById(notifications.getId());
        }
        for (Comment comment : commentRepository.findAllByPost(post).orElseThrow()) {
            commentRepository.deleteById(comment.getId());
        }
        for (Like like : likeRepository.findAllByPostId(post.getId()).orElseThrow()) {
            likeRepository.delete(like);
        }
        attachmentRepository.deleteById(post.getAttachment().getId());
        postRepository.deleteById(id);
    }

    public ApiResponse getAllPosts() {
        List<ResPost> resPosts = new ArrayList<>();
        for (Post post : postRepository.findAll()) {
            ResPost resPost = new ResPost();
            setPost(resPost, post);
            resPosts.add(resPost);
        }
        return new ApiResponse(true, resPosts);
    }
}
