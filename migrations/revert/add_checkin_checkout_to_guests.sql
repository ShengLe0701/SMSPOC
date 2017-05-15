-- Revert smspoc:add_checkin_checkout_to_guests from pg

BEGIN;

ALTER TABLE aa.guests
DROP COLUMN checkin_at;

ALTER TABLE aa.guests
DROP COLUMN checkout_at;

COMMIT;
