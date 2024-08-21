package it.city.insta_server.controller;

import it.city.insta_server.payload.ReqPost;
import it.city.insta_server.security.CurrentUser;
import it.city.insta_server.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/post")
public class PostController {

    private final PostService postService;

    @GetMapping("/get/{username}")
    public HttpEntity<?> getPostWithUser(@PathVariable String username, @CurrentUser UserDetails userDetails) {
        return ResponseEntity.ok(postService.getPostsWithUser(username, userDetails.getUsername()).getObject());
    }

    @GetMapping("/getOne/{id}")
    public HttpEntity<?> getPost(@PathVariable Long id, @CurrentUser UserDetails userDetails) {
        return ResponseEntity.ok(postService.getOne(id, userDetails.getUsername()));
    }

    @DeleteMapping("/delete/{id}")
    public void deletePost(@PathVariable Long id, @CurrentUser UserDetails userDetails) {
        postService.deletePost(id, userDetails.getUsername());
    }

    @PostMapping("/add")
    public HttpEntity<?> addPost(@CurrentUser UserDetails userDetails, @RequestBody ReqPost reqPost) {
        return ResponseEntity.ok(postService.addPost(userDetails.getUsername(), reqPost));
    }
    @GetMapping("/getAll")
    public ResponseEntity<?> getAllPosts(){
        return ResponseEntity.ok(postService.getAllPosts());
    }
}