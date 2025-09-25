package com.mueblestanquian.api.service;

import org.springframework.data.jpa.domain.Specification;
import java.util.Map;
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

    public Page<Organization> findByNameContaining(String name, Pageable pageable) {
        return organizationRepository.findByNameContainingIgnoreCase(name, pageable);
    }

    public Page<Organization> findByFilters(Map<String, String> filters, Pageable pageable) {
        Specification<Organization> spec = Specification.where((root, query, cb) -> cb.conjunction());
        java.util.Map<String, String> reservedWords = java.util.Map.of(
            "EQUAL", "eq",
            "NOT_EQUAL", "ne",
            "CONTAINS", "contains",
            "NOT_CONTAINS", "notcontains",
            "STARTS_WITH", "startswith",
            "ENDS_WITH", "endswith",
            "GREATER_THAN", "gt",
            "LESS_THAN", "lt",
            "GREATER_THAN_OR_EQUAL", "ge",
            "LESS_THAN_OR_EQUAL", "le"
        );
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        for (Map.Entry<String, String> entry : filters.entrySet()) {
            final String rawKey = entry.getKey();
            final String value = entry.getValue();
            final String field;
            String operator;
            if (rawKey.contains("__")) {
                String[] parts = rawKey.split("__", 2);
                field = parts[0];
                operator = parts[1];
            } else {
                field = rawKey;
                operator = "contains";
            }
            // Traducción de palabra reservada a operador
            operator = reservedWords.getOrDefault(operator, operator);

            // Soporte para constantes de tiempo
            final String timeValue;
            if (value != null) {
                if (value.matches("LAST_\\d+_DAYS")) {
                    int n = Integer.parseInt(value.replaceAll("LAST_(\\d+)_DAYS", "$1"));
                    java.time.LocalDateTime date = now.minusDays(n);
                    timeValue = date.toString();
                } else if (value.matches("LAST_\\d+_WEEKS")) {
                    int n = Integer.parseInt(value.replaceAll("LAST_(\\d+)_WEEKS", "$1"));
                    java.time.LocalDateTime date = now.minusWeeks(n);
                    timeValue = date.toString();
                } else if (value.matches("LAST_\\d+_MONTHS")) {
                    int n = Integer.parseInt(value.replaceAll("LAST_(\\d+)_MONTHS", "$1"));
                    java.time.LocalDateTime date = now.minusMonths(n);
                    timeValue = date.toString();
                } else if (value.matches("LAST_\\d+_MINUTES")) {
                    int n = Integer.parseInt(value.replaceAll("LAST_(\\d+)_MINUTES", "$1"));
                    java.time.LocalDateTime date = now.minusMinutes(n);
                    timeValue = date.toString();
                } else if (value.matches("LAST_\\d+_HOURS")) {
                    int n = Integer.parseInt(value.replaceAll("LAST_(\\d+)_HOURS", "$1"));
                    java.time.LocalDateTime date = now.minusHours(n);
                    timeValue = date.toString();
                } else {
                    timeValue = value;
                }
            } else {
                timeValue = value;
            }
            switch (operator) {
                case "contains":
                    spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get(field)), "%" + timeValue.toLowerCase() + "%"));
                    break;
                case "startswith":
                    spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get(field)), timeValue.toLowerCase() + "%"));
                    break;
                case "endswith":
                    spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get(field)), "%" + timeValue.toLowerCase()));
                    break;
                case "notcontains":
                    spec = spec.and((root, query, cb) -> cb.notLike(cb.lower(root.get(field)), "%" + timeValue.toLowerCase() + "%"));
                    break;
                case "eq":
                    spec = spec.and((root, query, cb) -> cb.equal(root.get(field), timeValue));
                    break;
                case "ne":
                    spec = spec.and((root, query, cb) -> cb.notEqual(root.get(field), timeValue));
                    break;
                case "gt":
                    spec = spec.and((root, query, cb) -> cb.greaterThan(root.get(field), timeValue));
                    break;
                case "lt":
                    spec = spec.and((root, query, cb) -> cb.lessThan(root.get(field), timeValue));
                    break;
                case "ge":
                    spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get(field), timeValue));
                    break;
                case "le":
                    spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get(field), timeValue));
                    break;
                default:
                    // Si el operador no es reconocido, ignora el filtro
                    break;
            }
        }
        return organizationRepository.findAll(spec, pageable);
    }
}