package com.mueblestanquian.api.model.admin;

import jakarta.persistence.*;
import java.util.UUID;
import java.sql.Timestamp;

@Entity
@Table(name = "profile", schema = "mt_admin")
public class Profile {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "org_id")
    private UUID orgId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

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

    public UUID getId() {
        return id;
    }
    public void setId(UUID id) {
        this.id = id;
    }
    // ...existing code...
}
