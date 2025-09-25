package com.mueblestanquian.api.model.admin;

import jakarta.persistence.*;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "record_type", schema = "mt_admin")
public class RecordType {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "org_id")
    private UUID orgId;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "created_by_id")
    private UUID createdById;

    @Column(name = "last_modified_date")
    private LocalDateTime lastModifiedDate;

    @Column(name = "last_modified_by_id")
    private UUID lastModifiedById;

    @Column(name = "last_activity_date")
    private LocalDateTime lastActivityDate;

    @Column(name = "last_viewed_date")
    private LocalDateTime lastViewedDate;

    @Column(name = "owner_id")
    private UUID ownerId;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }
    public UUID getOrgId() {
        return orgId;
    }
    public void setOrgId(UUID orgId) {
        this.orgId = orgId;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public LocalDateTime getCreatedDate() {
        return createdDate;
    }
    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
    public UUID getCreatedById() {
        return createdById;
    }
    public void setCreatedById(UUID createdById) {
        this.createdById = createdById;
    }
    public LocalDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }
    public UUID getLastModifiedById() {
        return lastModifiedById;
    }
    public void setLastModifiedById(UUID lastModifiedById) {
        this.lastModifiedById = lastModifiedById;
    }
    public LocalDateTime getLastActivityDate() {
        return lastActivityDate;
    }
    public void setLastActivityDate(LocalDateTime lastActivityDate) {
        this.lastActivityDate = lastActivityDate;
    }
    public LocalDateTime getLastViewedDate() {
        return lastViewedDate;
    }
    public void setLastViewedDate(LocalDateTime lastViewedDate) {
        this.lastViewedDate = lastViewedDate;
    }
    public UUID getOwnerId() {
        return ownerId;
    }
    public void setOwnerId(UUID ownerId) {
        this.ownerId = ownerId;
    }
}
