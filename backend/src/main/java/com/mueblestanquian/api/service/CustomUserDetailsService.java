package com.mueblestanquian.api.service;

import com.mueblestanquian.api.model.admin.User;
import com.mueblestanquian.api.model.auth.Authority;
import com.mueblestanquian.api.repository.admin.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(user.getAuthorities().stream()
                        .map(Authority::getAuthority)
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList()))
                .disabled(!user.isEnabled())
                .build();
    }
}
