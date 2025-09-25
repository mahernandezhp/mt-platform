package com.mueblestanquian.api.repository.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mueblestanquian.api.model.auth.RegisteredClientEntity;

@Repository
public interface RegisteredClientRepository extends JpaRepository<RegisteredClientEntity, String> {
    RegisteredClientEntity findByClientId(String clientId);
}
