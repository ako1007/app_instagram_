package it.city.insta_server.service;

import it.city.insta_server.entity.Message;
import it.city.insta_server.entity.User;
import it.city.insta_server.payload.ReqMessage;
import it.city.insta_server.repository.MessageRepository;
import it.city.insta_server.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    public Boolean getUser(ReqMessage reqMessage) {
        return userRepository.existsByUsername(reqMessage.getSenderName());
    }

    public Boolean addMessage(ReqMessage reqMessage) {
        Optional<User> sender = Optional.of(new User());
        Optional<User> receiver = Optional.of(new User());
        try {
            sender = userRepository.findByUsername(reqMessage.getSenderName());
            receiver = userRepository.findByUsername(reqMessage.getReceiverName());
        } catch (Exception ex) {
            String errorMessage = ex.getMessage();
        }
        if (sender.isPresent()) {
            if (receiver.isPresent()) {
                Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
                Message message = new Message();
                message.setReceiver(receiver.get());
                message.setSender(sender.get());
                message.setTimestamp(currentTimestamp);
                message.setMessage(reqMessage.getMessage());
                message.setStatus(reqMessage.getStatus());
                messageRepository.save(message);
                return true;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    @Transactional
    public List<ReqMessage> getAllUsersMessage(String reqMessage) {
        Optional<User> byUsername = userRepository.findByUsername(reqMessage);
        if (byUsername.isPresent()) {
            List<ReqMessage> messages = new ArrayList<>();
            for (Message message : messageRepository.findAll()) {
                if (message.getSender() == byUsername.get() || message.getReceiver() == byUsername.get()) {
                    ReqMessage reqMessage1 = new ReqMessage();
                    reqMessage1.setId(message.getId());
                    reqMessage1.setSenderName(message.getSender().getUsername());
                    Optional<User> byId = userRepository.findById(message.getReceiver().getId());
                    reqMessage1.setReceiverName(byId.get().getUsername());
                    reqMessage1.setMessage(message.getMessage());
                    reqMessage1.setDate(message.getTimestamp());
                    reqMessage1.setStatus(message.getStatus());
                    messages.add(reqMessage1);
                }
            }
            return messages;
        } else {
            return null;
        }
    }

    public List<ReqMessage> getOne(String name, String username){
        Optional<User> byUsername = userRepository.findByUsername(name);
        Optional<User> username1 = userRepository.findByUsername(username);
        if (byUsername.isPresent() && username1.isPresent()){
            List<ReqMessage>messages=new ArrayList<>();
            for (Message message : messageRepository.findAllBySenderAndReceiverOrderByTimestampDesc(username1, byUsername)) {
                ReqMessage message1=new ReqMessage();
                message1.setId(message.getId());
                message1.setMessage(message.getMessage());
                message1.setSenderName(message.getSender().getUsername());
                message1.setReceiverName(message.getReceiver().getUsername());
                message1.setStatus(message.getStatus());
                message1.setDate(message.getTimestamp());
                messages.add(message1);
            }
            return messages;

        }return null;



    }

    public void deleteMessage(Long message) {
        messageRepository.deleteById(message);

    }
}