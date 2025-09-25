package com.mueblestanquian.api.repository.admin;

import org.springframework.data.domain.Page;
import com.mueblestanquian.api.model.admin.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.UUID;

public interface OrganizationRepository extends JpaRepository<Organization, UUID>, JpaSpecificationExecutor<Organization> {
	Page<Organization> findByNameContainingIgnoreCase(String name, org.springframework.data.domain.Pageable pageable);
}
