package com.mueblestanquian.api.controller.admin;

import com.mueblestanquian.api.model.admin.User;
import com.mueblestanquian.api.repository.admin.UserRepository;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/users")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public CollectionModel<EntityModel<User>> all() {
        List<User> users = userRepository.findAll();
        List<EntityModel<User>> userModels = users.stream()
            .map(user -> EntityModel.of(user,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserController.class).one(user.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserController.class).all()).withRel("users")
            ))
            .collect(java.util.stream.Collectors.toList());
        return CollectionModel.of(userModels,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserController.class).all()).withSelfRel()
        );
    }

    @GetMapping("/{id}")
    public EntityModel<User> one(@PathVariable UUID id) {
        User user = userRepository.findById(id).orElseThrow();
        return EntityModel.of(user,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserController.class).one(id)).withSelfRel(),
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserController.class).all()).withRel("users")
        );
    }

    @PostMapping
    public ResponseEntity<EntityModel<User>> create(@RequestBody User user) {
        User saved = userRepository.save(user);
        return ResponseEntity.created(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserController.class).one(saved.getId())).toUri())
            .body(EntityModel.of(saved,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserController.class).one(saved.getId())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserController.class).all()).withRel("users")
            ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<User>> update(@PathVariable UUID id, @RequestBody User user) {
        User existing = userRepository.findById(id).orElseThrow();
        user.setId(id);
        User updated = userRepository.save(user);
        return ResponseEntity.ok(EntityModel.of(updated,
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserController.class).one(id)).withSelfRel(),
            WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserController.class).all()).withRel("users")
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
