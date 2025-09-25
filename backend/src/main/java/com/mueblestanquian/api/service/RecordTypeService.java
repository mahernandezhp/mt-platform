package com.mueblestanquian.api.service;

import com.mueblestanquian.api.model.admin.RecordType;
import com.mueblestanquian.api.repository.admin.RecordTypeRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class RecordTypeService {
    private final RecordTypeRepository repository;

    public RecordTypeService(RecordTypeRepository repository) {
        this.repository = repository;
    }

    public List<RecordType> findAll() {
        return repository.findAll();
    }

    public RecordType findById(UUID id) {
        return repository.findById(id).orElse(null);
    }

    public RecordType save(RecordType recordType) {
        return repository.save(recordType);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
