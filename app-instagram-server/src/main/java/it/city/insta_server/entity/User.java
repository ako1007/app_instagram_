package it.city.insta_server.entity;

import it.city.insta_server.entity.enums.Gender;
import it.city.insta_server.entity.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;
    @Column(nullable = false)
    private String fullName;
    @Column(nullable = false, unique = true)
    private String username;
    @Column(unique = true)
    private String email;
    @Column(unique = true)
    private String phoneNumber;
    @ManyToMany(fetch = FetchType.LAZY)
    private Set<User> followers;
    @ManyToMany(fetch = FetchType.LAZY)
    private Set<User> following;
    @Column(nullable = false)
    private String password;
    @ManyToOne
    private Attachment attachment;
    private String verificationPassword;
    @Enumerated(EnumType.STRING)
    private Role role;
    @OneToMany(fetch = FetchType.LAZY,mappedBy = "user")
    private List<Token> tokens;
    private String website;
    @Column(length = 150)
    private String bio;
    @Enumerated(EnumType.STRING)
    private Gender gender;
    @OneToMany(mappedBy = "user",
            orphanRemoval = true,
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL)
    private List<Post> posts;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }
    private boolean enabled=false;

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
