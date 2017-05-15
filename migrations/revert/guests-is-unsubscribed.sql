-- Revert smspoc:guests-is-unsubscribed from pg
BEGIN;

ALTER TABLE aa.guests
DROP COLUMN is_unsubscribed;

COMMIT;
