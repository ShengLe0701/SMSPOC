-- Verify smspoc:add_admin_to_users on pg

BEGIN;

SELECT is_admin
FROM aa.users
WHERE false;

ROLLBACK;
