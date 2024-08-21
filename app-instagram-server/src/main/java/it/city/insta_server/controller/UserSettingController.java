package it.city.insta_server.controller;

import it.city.insta_server.payload.ApiResponse;
import it.city.insta_server.payload.ReqChangePassword;
import it.city.insta_server.payload.ReqUserImg;
import it.city.insta_server.payload.ReqUserSettings;
import it.city.insta_server.security.CurrentUser;
import it.city.insta_server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
public class UserSettingController {
    private final UserService service;
    @PutMapping("/password/change")
    public ResponseEntity<ApiResponse> changePassword(@CurrentUser UserDetails userDetails,
                                                      @RequestBody ReqChangePassword reqChangePassword){
        ApiResponse response = service.changePassword(userDetails.getUsername(), reqChangePassword);
        return ResponseEntity.status(response.isSuccess()?200:409).body(response);
    }
    @PutMapping("/edit")
    public ResponseEntity<ApiResponse> changeProfile(@CurrentUser UserDetails userDetails,
                                                     @RequestBody ReqUserSettings settings){
        ApiResponse response = service.changeProfile(userDetails.getUsername(), settings);
        return ResponseEntity.status(response.isSuccess()?200:409).body(response);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse> deleteAccount(@CurrentUser UserDetails userDetails){
        ApiResponse response = service.deleteAccount(userDetails.getUsername());
        return ResponseEntity.status(response.isSuccess()?200:409).body(response);
    }
    @PutMapping("/img")
    public void changeImg(@CurrentUser UserDetails userDetails,@RequestBody ReqUserImg reqUserImg){
        service.changeProfileImg(userDetails.getUsername(), reqUserImg.getId());
    }
}
