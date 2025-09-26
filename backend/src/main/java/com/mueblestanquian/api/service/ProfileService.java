package com.mueblestanquian.api.service;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Map;
import java.util.UUID;
import com.mueblestanquian.api.model.admin.Profile;
import com.mueblestanquian.api.repository.admin.ProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public Page<Profile> findAll(Pageable pageable) {
        return profileRepository.findAll(pageable);
    }

    public Profile save(Profile profile) {
        return profileRepository.save(profile);
    }

    public void deleteById(UUID id) {
        profileRepository.deleteById(id);
    }

    public Page<Profile> findByFilters(Map<String, String> filters, Pageable pageable, String filterLogic) {
        // Copied and adapted from OrganizationService
        java.util.Map<String, Specification<Profile>> specs = new java.util.LinkedHashMap<>();
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
        int idx = 1;
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
            operator = reservedWords.getOrDefault(operator, operator);
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
            Specification<Profile> spec;
            switch (operator) {
                case "contains":
                    spec = (root, query, cb) -> cb.like(cb.lower(root.get(field)), "%" + timeValue.toLowerCase() + "%");
                    break;
                case "startswith":
                    spec = (root, query, cb) -> cb.like(cb.lower(root.get(field)), timeValue.toLowerCase() + "%");
                    break;
                case "endswith":
                    spec = (root, query, cb) -> cb.like(cb.lower(root.get(field)), "%" + timeValue.toLowerCase());
                    break;
                case "notcontains":
                    spec = (root, query, cb) -> cb.notLike(cb.lower(root.get(field)), "%" + timeValue.toLowerCase() + "%");
                    break;
                case "eq":
                    spec = (root, query, cb) -> cb.equal(root.get(field), timeValue);
                    break;
                case "ne":
                    spec = (root, query, cb) -> cb.notEqual(root.get(field), timeValue);
                    break;
                case "gt":
                    spec = (root, query, cb) -> cb.greaterThan(root.get(field), timeValue);
                    break;
                case "lt":
                    spec = (root, query, cb) -> cb.lessThan(root.get(field), timeValue);
                    break;
                case "ge":
                    spec = (root, query, cb) -> cb.greaterThanOrEqualTo(root.get(field), timeValue);
                    break;
                case "le":
                    spec = (root, query, cb) -> cb.lessThanOrEqualTo(root.get(field), timeValue);
                    break;
                default:
                    spec = null;
                    break;
            }
            if (spec != null) {
                specs.put(String.valueOf(idx), spec);
            }
            idx++;
        }
        Specification<Profile> finalSpec = null;
        if (filterLogic == null || filterLogic.equalsIgnoreCase("AND")) {
            for (Specification<Profile> s : specs.values()) {
                finalSpec = finalSpec == null ? Specification.where(s) : finalSpec.and(s);
            }
        } else if (filterLogic.equalsIgnoreCase("OR")) {
            for (Specification<Profile> s : specs.values()) {
                finalSpec = finalSpec == null ? Specification.where(s) : finalSpec.or(s);
            }
        } else {
            java.util.Stack<Specification<Profile>> stack = new java.util.Stack<>();
            java.util.Stack<String> opStack = new java.util.Stack<>();
            String expr = filterLogic.replaceAll("\\s+", "");
            int i = 0;
            while (i < expr.length()) {
                char c = expr.charAt(i);
                if (c == '(') {
                    opStack.push("(");
                    i++;
                } else if (c == ')') {
                    while (!opStack.isEmpty() && !opStack.peek().equals("(")) {
                        String op = opStack.pop();
                        Specification<Profile> right = stack.pop();
                        Specification<Profile> left = stack.pop();
                        stack.push(op.equals("AND") ? left.and(right) : left.or(right));
                    }
                    if (!opStack.isEmpty() && opStack.peek().equals("(")) {
                        opStack.pop();
                    }
                    i++;
                } else if (expr.startsWith("AND", i)) {
                    opStack.push("AND");
                    i += 3;
                } else if (expr.startsWith("OR", i)) {
                    opStack.push("OR");
                    i += 2;
                } else if (Character.isDigit(c)) {
                    int j = i;
                    while (j < expr.length() && Character.isDigit(expr.charAt(j))) j++;
                    String num = expr.substring(i, j);
                    Specification<Profile> s = specs.get(num);
                    stack.push(Specification.where(s));
                    i = j;
                } else {
                    i++;
                }
            }
            while (!opStack.isEmpty()) {
                String op = opStack.pop();
                Specification<Profile> right = stack.pop();
                Specification<Profile> left = stack.pop();
                stack.push(op.equals("AND") ? left.and(right) : left.or(right));
            }
            if (!stack.isEmpty()) {
                finalSpec = stack.pop();
            }
        }
        if (finalSpec == null) {
            finalSpec = Specification.where((root, query, cb) -> cb.conjunction());
        }
    return ((org.springframework.data.jpa.repository.JpaSpecificationExecutor<Profile>) profileRepository).findAll(finalSpec, pageable);
    }
}
