package com.mueblestanquian.api.model.auth;

import jakarta.persistence.*;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "oauth2_registered_client", schema = "mt_main")
public class RegisteredClientEntity {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(length = 36, updatable = false, nullable = false)
    private String id;

    @Column(name = "client_id", length = 100, nullable = false, unique = true)
    private String clientId;

    @Column(name = "client_id_issued_at")
    private java.time.Instant clientIdIssuedAt;

    @Column(name = "client_secret", length = 200)
    private String clientSecret;

    @Column(name = "client_secret_expires_at")
    private java.time.Instant clientSecretExpiresAt;

    @Column(name = "client_name", length = 200, nullable = false)
    private String clientName;

    @Column(name = "client_authentication_methods", length = 1000, nullable = false)
    private String clientAuthenticationMethods;

    @Column(name = "authorization_grant_types", length = 1000, nullable = false)
    private String authorizationGrantTypes;

    @Column(name = "redirect_uris", length = 1000)
    @JsonProperty("redirectUris")
    private String redirectUris;

    @Column(name = "post_logout_redirect_uris", length = 1000)
    @JsonProperty("postLogoutRedirectUris")
    private String postLogoutRedirectUris;

    @Column(name = "scopes", length = 1000, nullable = false)
    private String scopes;

    @Column(name = "client_settings", length = 2000, nullable = false)
    private String clientSettings;

    @Column(name = "token_settings", length = 2000, nullable = false)
    private String tokenSettings;

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
    public java.time.Instant getClientIdIssuedAt() { return clientIdIssuedAt; }
    public void setClientIdIssuedAt(java.time.Instant clientIdIssuedAt) { this.clientIdIssuedAt = clientIdIssuedAt; }
    public String getClientSecret() { return clientSecret; }
    public void setClientSecret(String clientSecret) { this.clientSecret = clientSecret; }
    public java.time.Instant getClientSecretExpiresAt() { return clientSecretExpiresAt; }
    public void setClientSecretExpiresAt(java.time.Instant clientSecretExpiresAt) { this.clientSecretExpiresAt = clientSecretExpiresAt; }
    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }
    public String getClientAuthenticationMethods() { return clientAuthenticationMethods; }
    public void setClientAuthenticationMethods(String clientAuthenticationMethods) { this.clientAuthenticationMethods = clientAuthenticationMethods; }
    public String getAuthorizationGrantTypes() { return authorizationGrantTypes; }
    public void setAuthorizationGrantTypes(String authorizationGrantTypes) { this.authorizationGrantTypes = authorizationGrantTypes; }
    public String getRedirectUris() { return redirectUris; }
    public void setRedirectUris(String redirectUris) { this.redirectUris = redirectUris; }
    public String getPostLogoutRedirectUris() { return postLogoutRedirectUris; }
    public void setPostLogoutRedirectUris(String postLogoutRedirectUris) { this.postLogoutRedirectUris = postLogoutRedirectUris; }
    public String getScopes() { return scopes; }
    public void setScopes(String scopes) { this.scopes = scopes; }
    public String getClientSettings() { return clientSettings; }
    public void setClientSettings(String clientSettings) { this.clientSettings = clientSettings; }
    public String getTokenSettings() { return tokenSettings; }
    public void setTokenSettings(String tokenSettings) { this.tokenSettings = tokenSettings; }
    //deserialization all fields
    @Override
    public String toString() {
        return "RegisteredClientEntity{" +
                "id='" + getId() + '\'' +
                ", clientId='" + getClientId() + '\'' +
                ", clientIdIssuedAt=" + getClientIdIssuedAt() +
                ", clientSecret='" + getClientSecret() + '\'' +
                ", clientSecretExpiresAt=" + getClientSecretExpiresAt() +
                ", clientName='" + getClientName() + '\'' +
                ", clientAuthenticationMethods='" + getClientAuthenticationMethods() + '\'' +
                ", authorizationGrantTypes='" + getAuthorizationGrantTypes() + '\'' +
                ", redirectUris='" + getRedirectUris() + '\'' +
                ", postLogoutRedirectUris='" + getPostLogoutRedirectUris() + '\'' +
                ", scopes='" + getScopes() + '\'' +
                ", clientSettings='" + getClientSettings() + '\'' +
                ", tokenSettings='" + getTokenSettings() + '\'' +
                "}";
    }
}
