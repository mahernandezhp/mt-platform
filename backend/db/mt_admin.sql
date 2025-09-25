CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE SCHEMA IF NOT EXISTS mt_admin;
SET search_path TO mt_admin;

-- Tabla de organizaciones
CREATE TABLE IF NOT EXISTS mt_admin.organization (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_id UUID REFERENCES mt_admin.user(id) DEFAULT NULL,
    last_modified_date TIMESTAMP,
    last_modified_by_id UUID REFERENCES mt_admin.user(id) DEFAULT NULL,
    last_activity_date TIMESTAMP,
    last_viewed_date TIMESTAMP DEFAULT NULL,
    owner_id UUID REFERENCES mt_admin.user(id) DEFAULT NULL,
    master_record_id UUID,
    record_type_id UUID
);

-- Tabla de tipos de registros
CREATE TABLE mt_admin.record_type (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES mt_admin.organization(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_id UUID DEFAULT NULL,
    last_modified_date TIMESTAMP,
    last_modified_by_id UUID DEFAULT NULL,
    last_activity_date TIMESTAMP,
    last_viewed_date TIMESTAMP DEFAULT NULL,
    owner_id UUID DEFAULT NULL
);

-- Tabla de roles de usuario
CREATE TABLE mt_admin.user_role (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES mt_admin.organization(id),
    user_id UUID DEFAULT NULL,
    parent_id UUID REFERENCES mt_admin.user_role(id),
    tree_order INTEGER,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_id UUID DEFAULT NULL,
    last_modified_date TIMESTAMP,
    last_modified_by_id UUID DEFAULT NULL,
    last_activity_date TIMESTAMP,
    last_viewed_date TIMESTAMP DEFAULT NULL,
    owner_id UUID DEFAULT NULL,
    record_type_id UUID REFERENCES mt_admin.record_type(id) DEFAULT NULL
);

-- Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS mt_admin.profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES mt_admin.organization(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_id UUID DEFAULT NULL,
    last_modified_date TIMESTAMP,
    last_modified_by_id UUID DEFAULT NULL,
    last_activity_date TIMESTAMP,
    last_viewed_date TIMESTAMP DEFAULT NULL,
    owner_id UUID DEFAULT NULL,
    record_type_id UUID REFERENCES mt_admin.record_type(id) DEFAULT NULL
);

-- Tabla de usuarios de la aplicación
CREATE TABLE IF NOT EXISTS mt_admin.user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES mt_admin.organization(id),
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    name VARCHAR(100),
    profile_id UUID REFERENCES mt_admin.profile(id),
    user_role_id UUID REFERENCES mt_admin.user_role(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_id UUID REFERENCES mt_admin.user(id) DEFAULT NULL,
    last_modified_date TIMESTAMP,
    last_modified_by_id UUID REFERENCES mt_admin.user(id) DEFAULT NULL,
    last_activity_date TIMESTAMP,
    last_viewed_date TIMESTAMP DEFAULT NULL,
    owner_id UUID REFERENCES mt_admin.user(id) DEFAULT NULL,
    record_type_id UUID REFERENCES mt_admin.record_type(id) DEFAULT NULL
);

-- Tabla para registrar los logins de acceso a la app
CREATE TABLE IF NOT EXISTS mt_admin.login_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES mt_admin.organization(id),
    user_id UUID REFERENCES mt_admin.user(id),
    app_id UUID REFERENCES mt_admin.application(id),
    login_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN DEFAULT TRUE,
    failure_reason TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_id UUID REFERENCES mt_admin.user(id),
    last_modified_date TIMESTAMP,
    last_modified_by_id UUID REFERENCES mt_admin.user(id)
);

-- Tabla de relación entre usuario y rol (asignación múltiple de roles a usuarios)
CREATE TABLE IF NOT EXISTS mt_admin.user_role_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES mt_admin.organization(id),
    user_id UUID REFERENCES mt_admin.user(id),
    user_role_id UUID REFERENCES mt_admin.user_role(id),
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by_id UUID REFERENCES mt_admin.user(id),
    last_modified_date TIMESTAMP,
    last_modified_by_id UUID REFERENCES mt_admin.user(id)
);

-- Tabla de objetos (representa entidades personalizables)
CREATE TABLE mt_admin.custom_object (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES mt_admin.organization(id),
    name VARCHAR(100) NOT NULL,
    plural_name VARCHAR(100) NOT NULL,
    singular_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_id UUID REFERENCES mt_admin.user(id),
    last_modified_date TIMESTAMP,
    last_modified_by_id UUID REFERENCES mt_admin.user(id),
    last_activity_date TIMESTAMP,
    last_viewed_date TIMESTAMP,
    owner_id UUID REFERENCES mt_admin.user(id),
    master_record_id UUID,
    record_type_id UUID REFERENCES mt_admin.record_type(id)
);

-- Tabla de campos (representa los atributos de cada objeto)
CREATE TABLE mt_admin.field (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    custom_object_id UUID REFERENCES mt_admin.custom_object(id),
    name VARCHAR(100) NOT NULL,
    label VARCHAR(100),
    data_type VARCHAR(50) NOT NULL,
    is_required BOOLEAN DEFAULT FALSE,
    is_unique BOOLEAN DEFAULT FALSE,
    default_value TEXT,
    description TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_id UUID REFERENCES mt_admin.user(id),
    last_modified_date TIMESTAMP,
    last_modified_by_id UUID REFERENCES mt_admin.user(id),
    last_activity_date TIMESTAMP,
    last_viewed_date TIMESTAMP,
    owner_id UUID REFERENCES mt_admin.user(id),
    master_record_id UUID,
    record_type_id UUID REFERENCES mt_admin.record_type(id)
);

CREATE TABLE mt_admin.application (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES mt_admin.organization(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_id UUID REFERENCES mt_admin.user(id),
    last_modified_date TIMESTAMP,
    last_modified_by_id UUID REFERENCES mt_admin.user(id),
    last_activity_date TIMESTAMP,
    last_viewed_date TIMESTAMP,
    owner_id UUID REFERENCES mt_admin.user(id),
    master_record_id UUID,
    record_type_id UUID
);


CREATE TABLE mt_admin.menu (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES mt_admin.organization(id),
    app_id UUID REFERENCES mt_admin.application(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_id UUID REFERENCES mt_admin.user(id),
    last_modified_date TIMESTAMP,
    last_modified_by_id UUID REFERENCES mt_admin.user(id),
    last_activity_date TIMESTAMP,
    last_viewed_date TIMESTAMP,
    owner_id UUID REFERENCES mt_admin.user(id),
    master_record_id UUID,
    record_type_id UUID
);


CREATE TABLE mt_admin.menu_item (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES mt_admin.organization(id),
    menu_id UUID REFERENCES mt_admin.menu(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    object_table VARCHAR(100),
    custom_screen VARCHAR(100),
    route VARCHAR(255),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_id UUID REFERENCES mt_admin.user(id),
    last_modified_date TIMESTAMP,
    last_modified_by_id UUID REFERENCES mt_admin.user(id),
    last_activity_date TIMESTAMP,
    last_viewed_date TIMESTAMP,
    owner_id UUID REFERENCES mt_admin.user(id),
    master_record_id UUID,
    record_type_id UUID
);


CREATE TABLE mt_admin.app_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES mt_admin.organization(id),
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    name VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_id UUID REFERENCES mt_admin.user(id),
    last_modified_date TIMESTAMP,
    last_modified_by_id UUID REFERENCES mt_admin.user(id),
    last_activity_date TIMESTAMP,
    last_viewed_date TIMESTAMP,
    owner_id UUID REFERENCES mt_admin.user(id),
    master_record_id UUID,
    record_type_id UUID
);


CREATE TABLE mt_admin.user_app_access (
    org_id UUID REFERENCES mt_admin.organization(id),
    user_id UUID REFERENCES mt_admin.app_user(id),
    app_id UUID REFERENCES mt_admin.application(id),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_id UUID REFERENCES mt_admin.user(id),
    last_modified_date TIMESTAMP,
    last_modified_by_id UUID REFERENCES mt_admin.user(id),
    last_activity_date TIMESTAMP,
    last_viewed_date TIMESTAMP,
    owner_id UUID REFERENCES mt_admin.user(id),
    master_record_id UUID,
    record_type_id UUID,
    PRIMARY KEY (org_id, user_id, app_id)
);


CREATE TABLE mt_admin.user_menu_item_access (
    org_id UUID REFERENCES mt_admin.organization(id),
    user_id UUID REFERENCES mt_admin.app_user(id),
    menu_item_id UUID REFERENCES mt_admin.menu_item(id),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_id UUID REFERENCES mt_admin.user(id),
    last_modified_date TIMESTAMP,
    last_modified_by_id UUID REFERENCES mt_admin.user(id),
    last_activity_date TIMESTAMP,
    last_viewed_date TIMESTAMP,
    owner_id UUID REFERENCES mt_admin.user(id),
    master_record_id UUID,
    record_type_id UUID,
    PRIMARY KEY (org_id, user_id, menu_item_id)
);