package it.city.insta_server.service;


import it.city.insta_server.entity.Comment;
import it.city.insta_server.entity.Post;
import it.city.insta_server.entity.User;
import it.city.insta_server.payload.ApiResponse;
import it.city.insta_server.payload.ReqComment;
import it.city.insta_server.payload.ResComment;
import it.city.insta_server.repository.CommentRepository;
import it.city.insta_server.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public ApiResponse addComment(User user, ReqComment reqComment, Long id) {
        add(user, new Comment(), reqComment, id);
        return new ApiResponse("Successfully added comment", true);
    }

    public ApiResponse getReplies(Long postId, Long commentId) {
        postRepository.findById(postId).orElseThrow(() -> new ResourceAccessException("post doesn't exist"));
        commentRepository.findById(commentId).orElseThrow(() -> new ResourceAccessException("comment doesn't exist"));
        List<Comment> comments = commentRepository.findAllByPostIdAndCommentId(postId, commentId);
        ApiResponse apiResponse = reply(comments);
        return apiResponse;
    }

    public ApiResponse getComments(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new ResourceAccessException("post doesn't exist"));
        List <Comment> comments = commentRepository.findAllByPostId(post.getId());
        return reply(comments);
    }

    public ApiResponse deleteComment(Long commentId) {
        commentRepository.findById(commentId).orElseThrow(() -> new ResourceAccessException("commment doesn't exist"));
        commentRepository.deleteById(commentId);
        commentRepository.deleteAllByCommentId(commentId);
        return new ApiResponse("Successfully deleted comment", true);
    }

    public void add(User user, Comment comment, ReqComment reqComment, Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceAccessException("addPost"));
        if (reqComment.getCommentId() != null) {
            Optional<Comment> byId = commentRepository.findById(reqComment.getCommentId());
            if (byId.isPresent()) {
                comment.setComment(byId.get());
            }
        }
        Timestamp time = new Timestamp(System.currentTimeMillis());
        comment.setTimestamp(time);
        comment.setText(reqComment.getText());
        comment.setPost(post);
        comment.setUser(user);
        commentRepository.save(comment);
    }
    public ApiResponse reply(List <Comment> comments){
        List<ResComment> resComments = new ArrayList<>();
        for (Comment comment : comments) {
            ResComment resComment = new ResComment();
            resComment.setId(comment.getId());
            resComment.setUser(comment.getUser().getUsername());
            resComment.setText(comment.getText());
            resComment.setTimestamp(comment.getTimestamp());
            if (comment.getComment() != null) {
                resComment.setCommentId(comment.getComment().getId());
            }
            resComment.setPostId(comment.getPost().getId());
            resComments.add(resComment);
        }
        return new ApiResponse(true, resComments);
    }
}



