package com.mueblestanquian.api.model.admin;

import jakarta.persistence.*;
import java.util.UUID;
import java.sql.Timestamp;

@Entity
@Table(name = "organization", schema = "mt_admin")
public class Organization {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "address")
    private String address;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

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

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
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
}
