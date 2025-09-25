package com.mueblestanquian.api.controller.admin;

import com.mueblestanquian.api.model.admin.Profile;
import com.mueblestanquian.api.repository.admin.ProfileRepository;

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
    private final ProfileRepository profileRepository;

    public ProfileController(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @GetMapping
    public CollectionModel<EntityModel<Profile>> all() {
        List<Profile> profiles = profileRepository.findAll();
        List<EntityModel<Profile>> profileModels = profiles.stream()
            .map(profile -> {
                EntityModel<Profile> model = EntityModel.of(profile,
                    WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProfileController.class).one(profile.getId())).withSelfRel(),
                    WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProfileController.class).all()).withRel("profiles")
                );
                if (profile.getOrgId() != null) {
                    model.add(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(OrganizationController.class).one(profile.getOrgId())).withRel("organization"));
                }
                return model;
            })
            .collect(java.util.stream.Collectors.toList());
        return CollectionModel.of(profileModels,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProfileController.class).all()).withSelfRel()
        );
    }

    @GetMapping("/{id}")
    public EntityModel<Profile> one(@PathVariable UUID id) {
        Profile profile = profileRepository.findById(id).orElseThrow();
        return EntityModel.of(profile,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProfileController.class).one(id)).withSelfRel(),
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProfileController.class).all()).withRel("profiles")
        );
    }

    @PostMapping
    public ResponseEntity<EntityModel<Profile>> create(@RequestBody Profile profile) {
        Profile saved = profileRepository.save(profile);
        return ResponseEntity.created(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProfileController.class).one(saved.getId())).toUri())
            .body(EntityModel.of(saved,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProfileController.class).one(saved.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProfileController.class).all()).withRel("profiles")
            ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<Profile>> update(@PathVariable UUID id, @RequestBody Profile profile) {
        profile.setId(id);
        Profile updated = profileRepository.save(profile);
        return ResponseEntity.ok(EntityModel.of(updated,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProfileController.class).one(id)).withSelfRel(),
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProfileController.class).all()).withRel("profiles")
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        profileRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
