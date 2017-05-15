-- Revert smspoc:active-flag-users from pg

BEGIN;

ALTER TABLE aa.users
DROP COLUMN is_active;

COMMIT;
