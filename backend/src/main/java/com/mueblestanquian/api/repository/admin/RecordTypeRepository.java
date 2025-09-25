package com.mueblestanquian.api.repository.admin;

import com.mueblestanquian.api.model.admin.RecordType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface RecordTypeRepository extends JpaRepository<RecordType, UUID> {
}
