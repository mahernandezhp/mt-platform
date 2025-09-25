-- Función para actualizar last_modified_date
CREATE OR REPLACE FUNCTION mt_admin_set_last_modified()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified_date = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para poblar last_modified_date automáticamente en UPDATE
DO $$
DECLARE
    tbl TEXT;
    tables TEXT[] := ARRAY[
        'organization', 'record_type', 'user_role', 'profile', 'user', 'login_audit',
        'user_role_user', 'custom_object', 'field', 'application', 'menu', 'menu_item',
        'app_user', 'user_app_access', 'user_menu_item_access'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        EXECUTE format('CREATE TRIGGER set_last_modified_date BEFORE UPDATE ON mt_admin.%I FOR EACH ROW EXECUTE FUNCTION mt_admin_set_last_modified();', tbl);
    END LOOP;
END$$;