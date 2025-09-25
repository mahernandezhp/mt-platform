package com.mueblestanquian.api.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.mueblestanquian.api.model.admin.Organization;
import com.mueblestanquian.api.repository.admin.OrganizationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrganizationService {
    private final OrganizationRepository organizationRepository;

    public OrganizationService(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    public Page<Organization> findAll(Pageable pageable) {
        return organizationRepository.findAll(pageable);
    }

    public Optional<Organization> findById(UUID id) {
        return organizationRepository.findById(id);
    }

    public Organization save(Organization org) {
        return organizationRepository.save(org);
    }

    public void deleteById(UUID id) {
        organizationRepository.deleteById(id);
    }
}
