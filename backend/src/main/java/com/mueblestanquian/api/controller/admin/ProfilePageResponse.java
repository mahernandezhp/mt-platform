package com.mueblestanquian.api.controller.admin;

import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.EntityModel;
import java.util.Map;
import com.mueblestanquian.api.model.admin.Profile;

public class ProfilePageResponse {
    private PagedModel<EntityModel<Profile>> page;
    private Map<String, Object> filters;

    public ProfilePageResponse(PagedModel<EntityModel<Profile>> page, Map<String, Object> filters) {
        this.page = page;
        this.filters = filters;
    }

    public PagedModel<EntityModel<Profile>> getPage() {
        return page;
    }

    public void setPage(PagedModel<EntityModel<Profile>> page) {
        this.page = page;
    }

    public Map<String, Object> getFilters() {
        return filters;
    }

    public void setFilters(Map<String, Object> filters) {
        this.filters = filters;
    }
}
