package com.mueblestanquian.api.controller.admin;

import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.*;
import org.springframework.hateoas.CollectionModel;
import com.mueblestanquian.api.model.admin.RecordType;
import com.mueblestanquian.api.model.admin.Organization;
import com.mueblestanquian.api.service.RecordTypeService;
import com.mueblestanquian.api.service.OrganizationService;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;

@RestController
@RequestMapping("/v1/orgs")
public class OrganizationController {
    private final OrganizationService organizationService;
    private final RecordTypeService recordTypeService;

    public OrganizationController(OrganizationService organizationService, RecordTypeService recordTypeService) {
        this.organizationService = organizationService;
        this.recordTypeService = recordTypeService;
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

    @GetMapping("/{id}/record-types")
    public CollectionModel<EntityModel<RecordType>> getRecordTypes(@PathVariable UUID id) {
        List<RecordType> recordTypes = recordTypeService.findAll().stream()
            .filter(rt -> id.equals(rt.getOrgId()))
            .collect(java.util.stream.Collectors.toList());
        List<EntityModel<RecordType>> models = recordTypes.stream()
            .map(rt -> EntityModel.of(rt,
                org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo(org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn(RecordTypeController.class).one(rt.getId())).withSelfRel(),
                org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo(org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn(RecordTypeController.class).all()).withRel("record-types")
            ))
            .collect(java.util.stream.Collectors.toList());
        return CollectionModel.of(models,
            org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo(org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn(OrganizationController.class).getRecordTypes(id)).withSelfRel()
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
