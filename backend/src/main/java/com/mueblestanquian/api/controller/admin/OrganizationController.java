package com.mueblestanquian.api.controller.admin;

import com.mueblestanquian.api.model.admin.Organization;
import com.mueblestanquian.api.service.OrganizationService;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/orgs")
public class OrganizationController {
    private final OrganizationService organizationService;

    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @GetMapping
    public CollectionModel<EntityModel<Organization>> all() {
        List<Organization> orgs = organizationService.findAll();
        List<EntityModel<Organization>> orgModels = orgs.stream()
            .map(org -> EntityModel.of(org,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(OrganizationController.class).one(org.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(OrganizationController.class).all()).withRel("orgs")
            ))
            .collect(java.util.stream.Collectors.toList());
        return CollectionModel.of(orgModels,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(OrganizationController.class).all()).withSelfRel()
        );
    }

    @GetMapping("/{id}")
    public EntityModel<Organization> one(@PathVariable UUID id) {
        Organization org = organizationService.findById(id).orElseThrow();
        return EntityModel.of(org,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(OrganizationController.class).one(id)).withSelfRel(),
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(OrganizationController.class).all()).withRel("orgs")
        );
    }

    @PostMapping
    public ResponseEntity<EntityModel<Organization>> create(@RequestBody Organization org) {
        Organization saved = organizationService.save(org);
        return ResponseEntity.created(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(OrganizationController.class).one(saved.getId())).toUri())
            .body(EntityModel.of(saved,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(OrganizationController.class).one(saved.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(OrganizationController.class).all()).withRel("orgs")
            ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<Organization>> update(@PathVariable UUID id, @RequestBody Organization org) {
        org.setId(id);
        Organization updated = organizationService.save(org);
        return ResponseEntity.ok(EntityModel.of(updated,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(OrganizationController.class).one(id)).withSelfRel(),
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(OrganizationController.class).all()).withRel("orgs")
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        organizationService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
