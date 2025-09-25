package com.mueblestanquian.api.repository.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mueblestanquian.api.model.auth.Authority;

public interface AuthorityRepository extends JpaRepository<Authority, Long> {
}
