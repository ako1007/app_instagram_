package it.city.insta_server.repository;

import it.city.insta_server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    @Query(value = "select * from users where email=?1 or username=?1 or phone_number=?1",nativeQuery = true)
    Optional<User> getUserBy3options(String option);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByUsernameAndIdNot(String username, UUID id);
    boolean existsByEmailAndIdNot(String email, UUID id);
    boolean existsByPhoneNumberAndIdNot(String phoneNumber, UUID id);
    boolean existsByUsernameIsLike(String username);

}
