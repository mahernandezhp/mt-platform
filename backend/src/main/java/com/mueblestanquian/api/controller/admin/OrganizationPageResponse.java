package com.mueblestanquian.api.controller.admin;

import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.EntityModel;
import java.util.Map;
import com.mueblestanquian.api.model.admin.Organization;

public class OrganizationPageResponse {
    private PagedModel<EntityModel<Organization>> page;
    private Map<String, Object> filters;

    public OrganizationPageResponse(PagedModel<EntityModel<Organization>> page, Map<String, Object> filters) {
        this.page = page;
        this.filters = filters;
    }

    public PagedModel<EntityModel<Organization>> getPage() {
        return page;
    }

    public void setPage(PagedModel<EntityModel<Organization>> page) {
        this.page = page;
    }

    public Map<String, Object> getFilters() {
        return filters;
    }

    public void setFilters(Map<String, Object> filters) {
        this.filters = filters;
    }
}
