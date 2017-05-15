-- Revert smspoc:is-archived-flag-guests from pg

BEGIN;

ALTER TABLE aa.guests
DROP COLUMN is_archived;

COMMIT;
