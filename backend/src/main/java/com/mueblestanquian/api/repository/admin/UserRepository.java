package com.mueblestanquian.api.repository.admin;

import com.mueblestanquian.api.model.admin.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.*;

public interface UserRepository extends JpaRepository<User, UUID> {
	Optional<User> findByUsername(String username);
}