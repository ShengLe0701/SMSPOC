-- Deploy smspoc:active-flag-users to pg

BEGIN;

ALTER TABLE aa.users
ADD COLUMN is_active boolean;

UPDATE aa.users
SET is_active = true;

ALTER TABLE aa.users
ALTER COLUMN is_active SET DEFAULT true;

ALTER TABLE aa.users
ALTER COLUMN is_active SET NOT NULL;

COMMIT;
