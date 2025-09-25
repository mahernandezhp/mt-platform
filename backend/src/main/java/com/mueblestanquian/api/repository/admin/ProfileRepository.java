package com.mueblestanquian.api.repository.admin;

import com.mueblestanquian.api.model.admin.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ProfileRepository extends JpaRepository<Profile, UUID> {
}
