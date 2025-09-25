package com.mueblestanquian.api.model.admin;

import jakarta.persistence.*;
import java.util.UUID;
import java.util.*;
import java.sql.Timestamp;
import com.mueblestanquian.api.model.auth.Authority;

@Entity
@Table(name = "user", schema = "mt_admin")
public class User {
    // Para compatibilidad con Spring Security
    @Transient
    private Set<Authority> authorities;

    public Set<Authority> getAuthorities() {
        return authorities != null ? authorities : java.util.Collections.emptySet();
    }
    public void setAuthorities(Set<Authority> authorities) {
        this.authorities = authorities;
    }
    public boolean isEnabled() {
        return Boolean.TRUE.equals(isActive);
    }
    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "org_id")
    private UUID orgId;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "email")
    private String email;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "profile_id")
    private Profile profile;

    @Column(name = "user_role_id")
    private UUID userRoleId;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_date")
    private Timestamp createdDate;

    @Column(name = "created_by_id")
    private UUID createdById;

    @Column(name = "last_modified_date")
    private Timestamp lastModifiedDate;

    @Column(name = "last_modified_by_id")
    private UUID lastModifiedById;

    @Column(name = "last_activity_date")
    private Timestamp lastActivityDate;

    @Column(name = "last_viewed_date")
    private Timestamp lastViewedDate;

    @Column(name = "owner_id")
    private UUID ownerId;

    @Column(name = "master_record_id")
    private UUID masterRecordId;

    @Column(name = "record_type_id")
    private UUID recordTypeId;

    @Column(name = "manager_id")
    private UUID managerId;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getOrgId() { return orgId; }
    public void setOrgId(UUID orgId) { this.orgId = orgId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Profile getProfile() { return profile; }
    public void setProfile(Profile profile) { this.profile = profile; }
    public UUID getUserRoleId() { return userRoleId; }
    public void setUserRoleId(UUID userRoleId) { this.userRoleId = userRoleId; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public Timestamp getCreatedDate() { return createdDate; }
    public void setCreatedDate(Timestamp createdDate) { this.createdDate = createdDate; }
    public UUID getCreatedById() { return createdById; }
    public void setCreatedById(UUID createdById) { this.createdById = createdById; }
    public Timestamp getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(Timestamp lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }
    public UUID getLastModifiedById() { return lastModifiedById; }
    public void setLastModifiedById(UUID lastModifiedById) { this.lastModifiedById = lastModifiedById; }
    public Timestamp getLastActivityDate() { return lastActivityDate; }
    public void setLastActivityDate(Timestamp lastActivityDate) { this.lastActivityDate = lastActivityDate; }
    public Timestamp getLastViewedDate() { return lastViewedDate; }
    public void setLastViewedDate(Timestamp lastViewedDate) { this.lastViewedDate = lastViewedDate; }
    public UUID getOwnerId() { return ownerId; }
    public void setOwnerId(UUID ownerId) { this.ownerId = ownerId; }
    public UUID getMasterRecordId() { return masterRecordId; }
    public void setMasterRecordId(UUID masterRecordId) { this.masterRecordId = masterRecordId; }
    public UUID getRecordTypeId() { return recordTypeId; }
    public void setRecordTypeId(UUID recordTypeId) { this.recordTypeId = recordTypeId; }
    public UUID getManagerId() { return managerId; }
    public void setManagerId(UUID managerId) { this.managerId = managerId; }
}
