package com.mueblestanquian.api.repository.admin;

import org.springframework.data.domain.Page;
import com.mueblestanquian.api.model.admin.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface OrganizationRepository extends JpaRepository<Organization, UUID> {
	Page<Organization> findByNameContainingIgnoreCase(String name, org.springframework.data.domain.Pageable pageable);
}
