-- Deploy smspoc:guests-is-verified to pg
BEGIN;

ALTER TABLE aa.guests
ADD COLUMN is_verified boolean;

UPDATE aa.guests
SET is_verified = true;

ALTER TABLE aa.guests
ALTER COLUMN is_verified SET NOT NULL;

COMMIT;
