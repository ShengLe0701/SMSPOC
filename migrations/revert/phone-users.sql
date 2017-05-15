-- Revert smspoc:phone-users from pg

BEGIN;

ALTER TABLE aa.users
DROP COLUMN phone;

COMMIT;
