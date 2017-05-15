-- Revert smspoc:guests-is-verified from pg
BEGIN;

ALTER TABLE aa.guests
DROP COLUMN is_verified;

COMMIT;
