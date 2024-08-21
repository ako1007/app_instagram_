package it.city.insta_server.controller;

import it.city.insta_server.payload.ApiResponse;
import it.city.insta_server.payload.ResUser;
import it.city.insta_server.security.CurrentUser;
import it.city.insta_server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v2/user")
public class UserController {
    private final UserService userService;

    @GetMapping("/{username}/follow")
    public HttpEntity<?> followUser(@PathVariable("username") String username, @CurrentUser UserDetails user) {
        userService.followUser(username, user.getUsername());
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/{username}/unfollow/{unUsername}")
    public HttpEntity<?> unfollowUser(@PathVariable("username") String username, @PathVariable String unUsername) {
        userService.unfollowUser(username, unUsername);
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/{username}/unfollow")
    public HttpEntity<?>unfollowFromUser(@PathVariable("username") String username,@CurrentUser UserDetails userDetails){
        userService.unfollowFromUser(username,userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/{username}/remove/{followerUN}")
    public void removeFollower(@PathVariable("username")String username,@PathVariable("followerUN") String followerUN,
                               @CurrentUser UserDetails user){
        userService.removeUser(username,user,followerUN);
    }

    @GetMapping("/{username}/followers")
    public HttpEntity<?> getFollowers(@PathVariable("username") String username,@CurrentUser UserDetails userDetails) {
        List<ResUser> followers = userService.getFollowers(username,userDetails.getUsername());
        return ResponseEntity.ok().body(followers);
    }

    @GetMapping("/{username}/following")
    public HttpEntity<?> getFollowing(@PathVariable("username") String username,@CurrentUser UserDetails userDetails) {
        List<ResUser> following = userService.getFollowing(username,userDetails.getUsername());
        return ResponseEntity.ok().body(following);
    }
    @GetMapping("/{username}")
    public  HttpEntity<?> getUser(@PathVariable("username") String username,@CurrentUser UserDetails userDetails){
        ApiResponse userByUsername = userService.getUserByUsername(username,userDetails.getUsername());
        return ResponseEntity.ok(userByUsername);
    }
    @GetMapping("/all")
    public  ResponseEntity<?> getAllUser(){
        ApiResponse allUsers = userService.getAllUsers();
        return ResponseEntity.ok(allUsers);
    }
}


