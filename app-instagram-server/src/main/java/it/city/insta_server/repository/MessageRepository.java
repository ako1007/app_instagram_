package it.city.insta_server.repository;

import it.city.insta_server.entity.Message;
//import it.city.insta_server.entity.User;
import it.city.insta_server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

//import java.util.List;

public interface MessageRepository extends JpaRepository<Message, UUID> {


    @Transactional
    Message findBySenderAndReceiverAndTimestamp(Optional<User> sender, Optional<User> receiver, Timestamp timestamp);

    @Transactional
    void deleteById(Long id);

    List<Message> findAllBySenderAndReceiverOrderByTimestampDesc(Optional<User> sender, Optional<User> receiver);

}