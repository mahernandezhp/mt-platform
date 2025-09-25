package com.mueblestanquian.api.repository.admin;

import com.mueblestanquian.api.model.admin.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface OrganizationRepository extends JpaRepository<Organization, UUID> {
}
