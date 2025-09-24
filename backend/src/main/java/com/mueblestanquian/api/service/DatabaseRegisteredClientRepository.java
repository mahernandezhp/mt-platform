package com.mueblestanquian.api.service;

import com.mueblestanquian.api.model.RegisteredClientEntity;
import com.mueblestanquian.api.repository.RegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.stereotype.Service;

@Service
public class DatabaseRegisteredClientRepository implements org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository {
    private final RegisteredClientRepository jpaRepository;

    public DatabaseRegisteredClientRepository(RegisteredClientRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public void save(RegisteredClient registeredClient) {
        RegisteredClientEntity entity = new RegisteredClientEntity();
    entity.setId(java.util.UUID.randomUUID().toString());
    entity.setClientId(registeredClient.getClientId());
    entity.setClientSecret(registeredClient.getClientSecret());
    entity.setScopes(String.join(",", registeredClient.getScopes()));
    // Set other fields as needed, e.g.:
    entity.setClientName(registeredClient.getClientId());
    entity.setClientAuthenticationMethods("client_secret_basic");
    entity.setAuthorizationGrantTypes("authorization_code,refresh_token");
    entity.setRedirectUris(String.join(",", registeredClient.getRedirectUris()));
    entity.setClientSettings("{}");
    entity.setTokenSettings("{}");
    jpaRepository.save(entity);
    }

    @Override
    public RegisteredClient findById(String id) {
        RegisteredClientEntity entity = jpaRepository.findById(id).orElse(null);
        return convertToRegisteredClient(entity);
    }

    @Override
    public RegisteredClient findByClientId(String clientId) {
        RegisteredClientEntity entity = jpaRepository.findByClientId(clientId);
        return convertToRegisteredClient(entity);
    }

    private RegisteredClient convertToRegisteredClient(RegisteredClientEntity entity) {
        if (entity == null) return null;
        return RegisteredClient.withId(entity.getId())
            .clientId(entity.getClientId())
            .clientSecret(entity.getClientSecret())
            .clientAuthenticationMethod(org.springframework.security.oauth2.core.ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
            .authorizationGrantType(org.springframework.security.oauth2.core.AuthorizationGrantType.AUTHORIZATION_CODE)
            .authorizationGrantType(org.springframework.security.oauth2.core.AuthorizationGrantType.REFRESH_TOKEN)
            .redirectUris(uris -> {
                if (entity.getRedirectUris() != null) {
                    uris.addAll(java.util.Arrays.asList(entity.getRedirectUris().split(",")));
                }
            })
            .scopes(scopes -> scopes.addAll(java.util.Arrays.asList(entity.getScopes().split(","))) )
            .build();
    }
}
