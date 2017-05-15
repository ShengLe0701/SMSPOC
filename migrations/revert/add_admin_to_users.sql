-- Revert smspoc:add_admin_to_users from pg

BEGIN;

ALTER TABLE aa.users
DROP COLUMN is_admin;


COMMIT;
