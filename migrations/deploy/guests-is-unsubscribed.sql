-- Deploy smspoc:guests-is-unsubscribed to pg
BEGIN;

ALTER TABLE aa.guests
ADD COLUMN is_unsubscribed boolean DEFAULT false;

UPDATE aa.guests
SET is_unsubscribed = false;

ALTER TABLE aa.guests
ALTER COLUMN is_unsubscribed SET NOT NULL;

COMMIT;
