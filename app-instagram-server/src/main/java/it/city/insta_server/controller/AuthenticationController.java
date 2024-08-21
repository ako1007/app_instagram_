package it.city.insta_server.controller;

import it.city.insta_server.payload.ApiResponse;
import it.city.insta_server.payload.AuthenticationRequest;
import it.city.insta_server.payload.AuthenticationResponse;
import it.city.insta_server.payload.RegisterRequest;
import it.city.insta_server.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {
        ApiResponse register = service.register(request);
        return ResponseEntity.status(register.isSuccess() ? 200 : 409).body(register);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

  @GetMapping("/verify/{password}")
  @ResponseBody
  public ResponseEntity<ApiResponse> verifyEmail(@PathVariable String password){
    ApiResponse verify = service.verify(password);
    return ResponseEntity.status(verify.isSuccess()?200:409).body(verify);
  }
}
