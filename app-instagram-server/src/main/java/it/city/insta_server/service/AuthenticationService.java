package it.city.insta_server.service;

import it.city.insta_server.entity.Token;
import it.city.insta_server.entity.User;
import it.city.insta_server.entity.enums.Role;
import it.city.insta_server.entity.enums.TokenType;
import it.city.insta_server.payload.*;
import it.city.insta_server.repository.TokenRepository;
import it.city.insta_server.repository.UserRepository;
import it.city.insta_server.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final SmsService smsService;
    private final UserRepository repository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final JavaMailSender javaMailSender;

    public ApiResponse register(RegisterRequest reqUser) {
        if (reqUser == null) {
            return new ApiResponse();
        }
        String password = passwordEncoder.encode(reqUser.getPassword());
        if (reqUser.getEmailOrPH().contains("@")) {
            if (!repository.existsByEmail(reqUser.getEmailOrPH())) {
                if (!repository.existsByUsername(reqUser.getUsername())) {
                    User user = new User();
                    user.setFullName(reqUser.getFullName());
                    user.setPassword(password);
                    user.setEmail(reqUser.getEmailOrPH());
                    user.setUsername(reqUser.getUsername());
                    user.setRole(Role.USER);
                    user.setVerificationPassword(String.valueOf(generateRandom(6)));
                    var savedUser = repository.save(user);
                    SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
                    simpleMailMessage.setFrom("no-reply@mail.instagram.com");
                    simpleMailMessage.setTo(reqUser.getEmailOrPH());
                    simpleMailMessage.setSubject("Verification");
                    simpleMailMessage.setText("  \n" +
                            "Hi,\n" +
                            "\n" +
                            "Someone tried to sign up for an Instagram account with " + reqUser.getEmailOrPH()
                            + ". If it was you, here is your verification code: " + savedUser.getVerificationPassword());
                    javaMailSender.send(simpleMailMessage);

                    return new ApiResponse("We sent verification url to your email, please verify your account.", true);
                }
                return new ApiResponse("Username already taken", false);
            }
            return new ApiResponse("Email already taken", false);
        } else {
            if (!repository.existsByPhoneNumber(reqUser.getEmailOrPH())) {
                if (!repository.existsByUsername(reqUser.getUsername())) {
                    User user = new User();
                    user.setFullName(reqUser.getFullName());
                    user.setPassword(password);
                    user.setPhoneNumber(reqUser.getEmailOrPH());
                    user.setUsername(reqUser.getUsername());
                    user.setRole(Role.USER);
                    user.setVerificationPassword(String.valueOf(generateRandom(6)));
                    var savedUser = repository.save(user);
                    ReqSendSms reqSendSms = new ReqSendSms();
                    reqSendSms.setMessage("  \n" +
                            "Hi,\n" +
                            "\n" +
                            "Someone tried to sign up for an Instagram account with " + reqUser.getEmailOrPH()
                            + ". If it was you, here is your verification code: " + savedUser.getVerificationPassword());
                    reqSendSms.setPhoneNumber(user.getPhoneNumber());
                    smsService.sendVerificationCode(reqSendSms);
                    return new ApiResponse("We sent verification url to your phone number, please verify your account.", true);
                }
                return new ApiResponse("Username already taken", false);
            }
            return new ApiResponse("Phone Number already taken", false);
        }
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {

        var user = repository.getUserBy3options(request.getUsername())
                .orElseThrow(() -> new ResourceAccessException("User not found"));
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        request.getPassword()
                )
        );

        if (user.isEnabled()) {
            var jwtToken = jwtService.generateToken(user);
            revokeAllUserTokens(user);
            saveUserToken(user, jwtToken);
            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .build();
        }
        return AuthenticationResponse.builder()
                .token("First verify your account")
                .build();
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public ApiResponse verify(String password) {
        for (User user : repository.findAll()) {
            if (user.getVerificationPassword() != null && user.getVerificationPassword().equals(password)) {
                user.setEnabled(true);
                user.setVerificationPassword(null);
                var savedUser = repository.save(user);
                var jwtToken = jwtService.generateToken(savedUser);
                saveUserToken(savedUser, jwtToken);
                return new ApiResponse(jwtToken, true);
            }
        }
        return new ApiResponse("LOL", false);
    }

    public int generateRandom(int integerLength) {
        Random random = new Random();
        int min = (int) Math.pow(10, integerLength - 1);
        int max = (int) Math.pow(10, integerLength) - 1;
        return random.nextInt(max - min + 1) + min;
    }
}
