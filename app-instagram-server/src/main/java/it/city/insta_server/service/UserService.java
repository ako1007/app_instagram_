package it.city.insta_server.service;

import it.city.insta_server.entity.Attachment;
import it.city.insta_server.entity.User;
import it.city.insta_server.entity.enums.Gender;
import it.city.insta_server.payload.*;
import it.city.insta_server.repository.AttachmentRepository;
import it.city.insta_server.repository.TokenRepository;
import it.city.insta_server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.ResourceAccessException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final AttachmentRepository attachmentRepository;

    public void followUser(String username, String followerUsername) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new ResourceAccessException("user"));
        User follower = userRepository.findByUsername(followerUsername).orElseThrow(() -> new ResourceAccessException("user"));
        if (user.getId() == follower.getId()) {
            return;
        }
        user.getFollowers().add(follower);
        follower.getFollowing().add(user);
        userRepository.save(user);
        userRepository.save(follower);
    }
    public void unfollowUser(String username, String followerUsername) {
        User follower = userRepository.findByUsername(username).orElseThrow(() -> new ResourceAccessException("user"));
        User user = userRepository.findByUsername(followerUsername).orElseThrow(() -> new ResourceAccessException("user"));
        user.getFollowers().remove(follower);
        follower.getFollowing().remove(user);
        userRepository.save(user);
        userRepository.save(follower);
    }
    public void unfollowFromUser(String username,String followerUsername){
        User user = userRepository.findByUsername(username).orElseThrow(() -> new ResourceAccessException("user"));
        User follower = userRepository.findByUsername(followerUsername).orElseThrow(() -> new ResourceAccessException("user"));
        user.getFollowers().remove(follower);
        follower.getFollowing().remove(user);
        userRepository.save(follower);
        userRepository.save(user);
    }

    public List<ResUser> getFollowers(String username,String activeUsername) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new ResourceAccessException("UserNotFound"));
        List<ResUser> resUsers = new ArrayList<>();
        for (User follower : user.getFollowers()) {
            setUser(resUsers, follower,isUserFollowed(user,activeUsername));
        }
        return resUsers;
    }

    public List<ResUser> getFollowing(String username,String activeUsername) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new ResourceAccessException("User"));
        List<ResUser> followings = new ArrayList<>();
        for (User following : user.getFollowing()) {
            setUser(followings, following,false);
        }
        return followings;
    }

    private void setUser(List<ResUser> resUsers, User follower,boolean isFollowed) {
        ResUser resUser1 = new ResUser();
        resUser1.setFullName(follower.getFullName());
        resUser1.setUsername(follower.getUsername());
        if (follower.getEmail() == null) {
            resUser1.setEmail(null);
        } else {
            resUser1.setEmail(follower.getEmail());
        }
        if (follower.getPhoneNumber() == null) {
            resUser1.setPhoneNumber(null);
        } else {
            resUser1.setPhoneNumber(follower.getPhoneNumber());
        }
        if (follower.getWebsite() == null) {
            resUser1.setWebsite(null);
        } else {
            resUser1.setWebsite(follower.getWebsite());
        }
        if (follower.getGender() == null) {
            resUser1.setGender(null);
        } else {
            resUser1.setGender(follower.getGender().name());
        }
        if (follower.getWebsite() == null) {
            resUser1.setWebsite(null);
        } else {
            resUser1.setWebsite(follower.getWebsite());
        }
        if (follower.getBio() == null) {
            resUser1.setBio(null);
        } else {
            resUser1.setBio(follower.getBio());
        }
        if (follower.getAttachment() == null) {
            resUser1.setAttachmentId(null);
        } else {
            resUser1.setAttachmentId(follower.getAttachment().getId());
        }
        resUser1.setFollowedUser(isFollowed);
        resUsers.add(resUser1);
    }

    public ApiResponse getUserByUsername(String username,String activeUsername) {
        User user = userRepository.findByUsername(username).orElseThrow();
        ResUser resUser = new ResUser();
        resUser.setFullName(user.getFullName());
        resUser.setUsername(user.getUsername());
        if (user.getEmail() == null) {
            resUser.setEmail(null);
        } else {
            resUser.setEmail(user.getEmail());
        }
        if (user.getPhoneNumber() == null) {
            resUser.setPhoneNumber(null);
        } else {
            resUser.setPhoneNumber(user.getPhoneNumber());
        }
        if (user.getWebsite() == null) {
            resUser.setWebsite(null);
        } else {
            resUser.setWebsite(user.getWebsite());
        }
        if (user.getGender() == null) {
            resUser.setGender(null);
        } else {
            resUser.setGender(user.getGender().name());
        }
        if (user.getWebsite() == null) {
            resUser.setWebsite(null);
        } else {
            resUser.setWebsite(user.getWebsite());
        }
        if (user.getBio() == null) {
            resUser.setBio(null);
        } else {
            resUser.setBio(user.getBio());
        }
        if (user.getAttachment() == null) {
            resUser.setAttachmentId(null);
        } else {
            resUser.setAttachmentId(user.getAttachment().getId());
        }
        resUser.setFollowedUser(isUserFollowed(user,activeUsername));
        resUser.setPostcount(user.getPosts().size());
        resUser.setFollowers(getFollowers(username,activeUsername));
        resUser.setFollowing(getFollowing(username,activeUsername));
        return new ApiResponse(true, resUser);
    }

    public ApiResponse changePassword(String username, ReqChangePassword changePassword) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new ResourceAccessException("user"));
        if (!passwordEncoder.matches(changePassword.getOldPassword(), user.getPassword()))
            return new ApiResponse("Your old password was entered incorrectly. Please enter it again.", false);
        if (!changePassword.getNewPassword().equals(changePassword.getConfirmNewPassword()))
            return new ApiResponse("Please make sure both passwords match.", false);
        String encode = passwordEncoder.encode(changePassword.getNewPassword());
        user.setPassword(encode);
        userRepository.save(user);
        return new ApiResponse("Password successfully changed", true);
    }

    public ApiResponse changeProfile(String username, ReqUserSettings settings) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new ResourceAccessException("user"));
        if (settings.getFullName() != null) user.setFullName(settings.getFullName());
        if (settings.getGender() != null) user.setGender(Gender.valueOf(settings.getGender()));
        if (settings.getWebsiteUrl() != null) user.setWebsite(settings.getWebsiteUrl());
        if (settings.getBio() != null) user.setBio(settings.getBio());
        if (settings.getAttachmentId() != null && attachmentRepository.existsById(settings.getAttachmentId()))
            user.setAttachment(attachmentRepository.findById(settings.getAttachmentId()).orElseThrow());
        if (user.getEmail() == null) {
            if (settings.getPhoneNumber() != null && settings.getPhoneNumber().length() == 13 &&
                    !userRepository.existsByPhoneNumberAndIdNot(settings.getPhoneNumber(), user.getId()))
                user.setPhoneNumber(settings.getPhoneNumber());
        } else if (user.getPhoneNumber() == null) {
            if (settings.getEmail() != null && settings.getEmail().length() >= 3 &&
                    settings.getEmail().contains("@") &&
                    !userRepository.existsByEmailAndIdNot(settings.getEmail(), user.getId()))
                user.setEmail(settings.getEmail());
        } else {
            if (settings.getPhoneNumber() != null && settings.getPhoneNumber().length() == 13 &&
                    !userRepository.existsByPhoneNumberAndIdNot(settings.getPhoneNumber(), user.getId()))
                user.setPhoneNumber(settings.getPhoneNumber());
            if (settings.getEmail() != null && settings.getEmail().length() >= 3 &&
                    settings.getEmail().contains("@") &&
                    !userRepository.existsByEmailAndIdNot(settings.getEmail(), user.getId()))
                user.setEmail(settings.getEmail());
        }

        if (settings.getUsername() != null && settings.getUsername().length() >= 3
                &&!user.getUsername().equals(settings.getUsername())&& !userRepository.existsByUsernameAndIdNot(settings.getUsername(), user.getId())) {
            user.setUsername(settings.getUsername());
            userRepository.save(user);
        }
        userRepository.save(user);
        return new ApiResponse("Profile updated.", true);
    }

    @Transactional
    public ApiResponse deleteAccount(String username) {
        try {
            User user = userRepository.findByUsername(username).orElseThrow(() -> new ResourceAccessException("user"));
            tokenRepository.deleteByUser(user);
            userRepository.delete(user);
            return new ApiResponse("Your account deleted", true);
        } catch (Exception e) {
            return new ApiResponse("Delete failed :" + e, false);
        }
    }

    public void removeUser(String username, UserDetails user, String followerUN) {
        if (!user.getUsername().equals(username)) return;
        User user1 = userRepository.findByUsername(username).orElseThrow();
        User follower = userRepository.findByUsername(followerUN).orElseThrow();
        follower.getFollowing().remove(user1);
        user1.getFollowers().remove(follower);
        userRepository.save(follower);
        userRepository.save(user1);
    }
    public void changeProfileImg(String username, UUID attachmentId){
        User user = userRepository.findByUsername(username).orElseThrow();
        Attachment attachment = attachmentRepository.findById(attachmentId).orElseThrow();
        user.setAttachment(attachment);
        userRepository.save(user);
    }

    public boolean isUserFollowed(User user,String activeUsername){
        User user1 = userRepository.findByUsername(activeUsername).orElseThrow();
        return user.getFollowers().contains(user1);
    }

    public ApiResponse getAllUsers(){
        List<ResSearchResult> resUsers=new ArrayList<>();
        for (User user : userRepository.findAll()) {
            ResSearchResult result=new ResSearchResult();
            if (user.getAttachment()!=null) {
                result.setAttachmentId(user.getAttachment().getId());
            }
            result.setId(user.getId());
            result.setUsername(user.getUsername());
            result.setFullName(user.getFullName());
            resUsers.add(result);
        }
        return new ApiResponse(true,resUsers);
    }
}
