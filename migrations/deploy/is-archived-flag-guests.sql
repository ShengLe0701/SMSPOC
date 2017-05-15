-- Deploy smspoc:is-archived-flag-guests to pg

BEGIN;

ALTER TABLE aa.guests
ADD COLUMN is_archived boolean;

UPDATE aa.guests
SET is_archived = false;

ALTER TABLE aa.guests
ALTER COLUMN is_archived SET DEFAULT false;

ALTER TABLE aa.guests
ALTER COLUMN is_archived SET NOT NULL;

COMMIT;
