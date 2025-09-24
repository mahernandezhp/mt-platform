package com.mueblestanquian.api.repository;

import com.mueblestanquian.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
}
