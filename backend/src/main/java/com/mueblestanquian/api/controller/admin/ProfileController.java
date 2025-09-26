package com.mueblestanquian.api.controller.admin;

import com.mueblestanquian.api.model.admin.Profile;
import com.mueblestanquian.api.service.ProfileService;
import java.util.Map;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/profiles")
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ProfilePageResponse all(org.springframework.data.domain.Pageable pageable, @RequestParam Map<String, String> filters) {
        Map<String, String> filterParams = new java.util.HashMap<>(filters);
        String filterLogic = filterParams.remove("filter_logic");
        String sortParam = filters.get("sort");
        filterParams.remove("page");
        filterParams.remove("size");
        filterParams.remove("sort");

        org.springframework.data.domain.Sort sort = pageable.getSort();
        if (sortParam != null && !sortParam.isEmpty()) {
            String[] sortFields = sortParam.split(",");
            org.springframework.data.domain.Sort.Order[] orders = java.util.Arrays.stream(sortFields)
                .map(s -> {
                    String[] parts = s.split(":");
                    String field = parts[0];
                    String direction = parts.length > 1 ? parts[1] : "asc";
                    return new org.springframework.data.domain.Sort.Order(
                        direction.equalsIgnoreCase("desc") ? org.springframework.data.domain.Sort.Direction.DESC : org.springframework.data.domain.Sort.Direction.ASC,
                        field
                    );
                })
                .toArray(org.springframework.data.domain.Sort.Order[]::new);
            sort = org.springframework.data.domain.Sort.by(orders);
            pageable = org.springframework.data.domain.PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        }

        org.springframework.data.domain.Page<Profile> profiles;
        if (!filterParams.isEmpty()) {
            profiles = profileService.findByFilters(filterParams, pageable, filterLogic);
        } else {
            profiles = profileService.findAll(pageable);
        }
        java.util.List<org.springframework.hateoas.EntityModel<Profile>> profileModels = profiles.getContent().stream()
            .map(profile -> {
                org.springframework.hateoas.EntityModel<Profile> model = org.springframework.hateoas.EntityModel.of(profile,
                    WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProfileController.class).one(profile.getId())).withSelfRel(),
                    WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProfileController.class).all(org.springframework.data.domain.Pageable.unpaged(), null)).withRel("profiles")
                );
                if (profile.getOrgId() != null) {
                    model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(OrganizationController.class).one(profile.getOrgId())).withRel("organization"));
                }
                return model;
            })
            .collect(java.util.stream.Collectors.toList());

        org.springframework.hateoas.PagedModel.PageMetadata metadata = new org.springframework.hateoas.PagedModel.PageMetadata(
            profiles.getSize(), profiles.getNumber() + 1, profiles.getTotalElements(), profiles.getTotalPages()
        );

        Map<String, Object> filterInfo = new java.util.HashMap<>();
        java.util.List<java.util.Map<String, String>> fieldsList = new java.util.ArrayList<>();
        java.util.List<java.util.Map<String, String>> filtersList = new java.util.ArrayList<>();
        for (String key : filterParams.keySet()) {
            final String fieldName;
            final String filterConst;
            if (key.contains("__")) {
                String[] parts = key.split("__", 2);
                fieldName = parts[0];
                filterConst = parts[1];
            } else {
                fieldName = key;
                filterConst = "";
            }
            if (fieldsList.stream().noneMatch(f -> f.get("field").equals(fieldName))) {
                java.util.Map<String, String> fieldObj = new java.util.HashMap<>();
                fieldObj.put("field", fieldName);
                fieldsList.add(fieldObj);
            }
            java.util.Map<String, String> filterObj = new java.util.HashMap<>();
            filterObj.put("field", fieldName);
            filterObj.put("filter", filterConst);
            filterObj.put("value", filterParams.get(key));
            filtersList.add(filterObj);
        }
        filterInfo.put("filters", filtersList);
        filterInfo.put("logic", filterLogic);
        java.util.List<java.util.Map<String, String>> sortList = new java.util.ArrayList<>();
        if (sortParam != null && !sortParam.isEmpty()) {
            String[] sortFields = sortParam.split(",");
            for (String s : sortFields) {
                String[] parts = s.split(":");
                String field = parts[0];
                String direction = parts.length > 1 ? parts[1] : "asc";
                java.util.Map<String, String> sortObj = new java.util.HashMap<>();
                sortObj.put("field", field);
                sortObj.put("direction", direction);
                sortList.add(sortObj);
            }
        }
        filterInfo.put("sort", sortList);

        org.springframework.hateoas.PagedModel<org.springframework.hateoas.EntityModel<Profile>> pagedModel = org.springframework.hateoas.PagedModel.of(profileModels, metadata);
        String baseUrl = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProfileController.class).all(org.springframework.data.domain.Pageable.unpaged(), null)).toUri().toString();
        org.springframework.web.util.UriComponentsBuilder builder = org.springframework.web.util.UriComponentsBuilder.fromUriString(baseUrl);
        for (Map.Entry<String, String> entry : filterParams.entrySet()) {
            builder.replaceQueryParam(entry.getKey(), entry.getValue());
        }
        String selfHref = builder.replaceQueryParam("page", profiles.getNumber() + 1).toUriString();
        pagedModel.add(org.springframework.hateoas.Link.of(selfHref, "self"));
        if (profiles.hasNext()) {
            org.springframework.data.domain.Pageable nextPage = profiles.nextPageable();
            String nextHref = builder.replaceQueryParam("page", nextPage.getPageNumber() + 1).toUriString();
            pagedModel.add(org.springframework.hateoas.Link.of(nextHref, "next"));
        }
        if (profiles.hasPrevious()) {
            org.springframework.data.domain.Pageable prevPage = profiles.previousPageable();
            String prevHref = builder.replaceQueryParam("page", prevPage.getPageNumber() + 1).toUriString();
            pagedModel.add(org.springframework.hateoas.Link.of(prevHref, "prev"));
        }
        return new ProfilePageResponse(pagedModel, filterInfo);
    }

    @GetMapping("/{id}")
    public EntityModel<Profile> one(@PathVariable UUID id) {
        Profile profile = profileService.findAll(org.springframework.data.domain.Pageable.unpaged())
            .getContent().stream().filter(p -> p.getId().equals(id)).findFirst().orElseThrow();
        return EntityModel.of(profile,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProfileController.class).one(id)).withSelfRel(),
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProfileController.class).all(org.springframework.data.domain.Pageable.unpaged(), null)).withRel("profiles")
        );
    }

    @PostMapping
    public ResponseEntity<EntityModel<Profile>> create(@RequestBody Profile profile) {
        Profile saved = profileService.save(profile);
        return ResponseEntity.created(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProfileController.class).one(saved.getId())).toUri())
            .body(EntityModel.of(saved,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProfileController.class).one(saved.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProfileController.class).all(org.springframework.data.domain.Pageable.unpaged(), null)).withRel("profiles")
            ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<Profile>> update(@PathVariable UUID id, @RequestBody Profile profile) {
        profile.setId(id);
        Profile updated = profileService.save(profile);
        return ResponseEntity.ok(EntityModel.of(updated,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProfileController.class).one(id)).withSelfRel(),
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProfileController.class).all(org.springframework.data.domain.Pageable.unpaged(), null)).withRel("profiles")
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        profileService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
