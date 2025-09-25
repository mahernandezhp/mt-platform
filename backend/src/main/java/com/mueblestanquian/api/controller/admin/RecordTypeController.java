package com.mueblestanquian.api.controller.admin;

import com.mueblestanquian.api.model.admin.RecordType;
import com.mueblestanquian.api.service.RecordTypeService;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/v1/record-types")
public class RecordTypeController {
    private final RecordTypeService service;

    public RecordTypeController(RecordTypeService service) {
        this.service = service;
    }

    @GetMapping
    public CollectionModel<EntityModel<RecordType>> all() {
        List<RecordType> recordTypes = service.findAll();
        List<EntityModel<RecordType>> recordTypeModels = recordTypes.stream()
            .map(rt -> {
                EntityModel<RecordType> model = EntityModel.of(rt,
                    WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(RecordTypeController.class).one(rt.getId())).withSelfRel(),
                    WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(RecordTypeController.class).all()).withRel("record-types")
                );
                if (rt.getOrgId() != null) {
                    model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(OrganizationController.class).one(rt.getOrgId())).withRel("organization"));
                }
                return model;
            })
            .collect(java.util.stream.Collectors.toList());
        return CollectionModel.of(recordTypeModels,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(RecordTypeController.class).all()).withSelfRel()
        );
    }

    @GetMapping("/{id}")
    public EntityModel<RecordType> one(@PathVariable UUID id) {
        RecordType recordType = service.findById(id);
        EntityModel<RecordType> model = EntityModel.of(recordType,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(RecordTypeController.class).one(id)).withSelfRel(),
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(RecordTypeController.class).all()).withRel("record-types")
        );
        if (recordType.getOrgId() != null) {
            model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(OrganizationController.class).one(recordType.getOrgId())).withRel("organization"));
        }
        return model;
    }

    @PostMapping
    public EntityModel<RecordType> create(@RequestBody RecordType recordType) {
        RecordType saved = service.save(recordType);
        EntityModel<RecordType> model = EntityModel.of(saved,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(RecordTypeController.class).one(saved.getId())).withSelfRel(),
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(RecordTypeController.class).all()).withRel("record-types")
        );
        if (saved.getOrgId() != null) {
            model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(OrganizationController.class).one(saved.getOrgId())).withRel("organization"));
        }
        return model;
    }

    @PutMapping("/{id}")
    public EntityModel<RecordType> update(@PathVariable UUID id, @RequestBody RecordType recordType) {
        recordType.setId(id);
        RecordType updated = service.save(recordType);
        EntityModel<RecordType> model = EntityModel.of(updated,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(RecordTypeController.class).one(id)).withSelfRel(),
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(RecordTypeController.class).all()).withRel("record-types")
        );
        if (updated.getOrgId() != null) {
            model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(OrganizationController.class).one(updated.getOrgId())).withRel("organization"));
        }
        return model;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
