package com.mueblestanquian.api.repository;

import com.mueblestanquian.api.model.RegisteredClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegisteredClientRepository extends JpaRepository<RegisteredClientEntity, String> {
    RegisteredClientEntity findByClientId(String clientId);
}
