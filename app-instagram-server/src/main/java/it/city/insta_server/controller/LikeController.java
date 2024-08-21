package it.city.insta_server.controller;
import it.city.insta_server.payload.ApiResponse;
import it.city.insta_server.security.CurrentUser;
import it.city.insta_server.service.LikeService;
import org.apache.http.HttpEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/like")
public class LikeController {
    @Autowired
    private LikeService likeService;

    @PostMapping("/likes/{id}")
    public void saveLike(@PathVariable Long id, @CurrentUser UserDetails userDetails) {
        likeService.likePost(id, userDetails.getUsername());
    }
    @GetMapping("/check/{postId}")
    public ResponseEntity<?> isLikedByUser(@PathVariable Long postId, @CurrentUser UserDetails userDetails){
        ApiResponse apiResponse = likeService.checkLike(postId, userDetails.getUsername());
        return ResponseEntity.ok(apiResponse);
    }
}
