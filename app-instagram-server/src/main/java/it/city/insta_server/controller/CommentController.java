package it.city.insta_server.controller;


import it.city.insta_server.entity.User;
import it.city.insta_server.payload.ApiResponse;
import it.city.insta_server.payload.ReqComment;
import it.city.insta_server.security.CurrentUser;
import it.city.insta_server.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @PostMapping("/add/{id}")
    public HttpEntity<?> addComment(@RequestBody ReqComment reqComment, @CurrentUser User user, @PathVariable Long id) {
        ApiResponse apiResponse = commentService.addComment(user, reqComment, id);
        return ResponseEntity.status(apiResponse.isSuccess() ? 200 : 409).body(apiResponse);
    }

    @DeleteMapping("/delete/{id}")
    public HttpEntity<?> deleteComment(@PathVariable Long id) {
        ApiResponse apiResponse = commentService.deleteComment(id);
        return ResponseEntity.status(apiResponse.isSuccess() ? 200 : 409).body(apiResponse);
    }

    @GetMapping("/get/{id}")
    public HttpEntity<?> getComment(@PathVariable Long id) {
        ApiResponse apiResponse = commentService.getComments(id);
        return ResponseEntity.status(apiResponse.isSuccess() ? 200 : 409).body(apiResponse);
    }

    @GetMapping("/reply/{postId}/{commentId}")
    public HttpEntity<?> getReply(@PathVariable Long postId, @PathVariable Long commentId) {
        ApiResponse apiResponse = commentService.getReplies(postId, commentId);
        return ResponseEntity.status(apiResponse.isSuccess() ? 200 : 409).body(apiResponse);
    }
}