-- Deploy smspoc:add_admin_to_users to pg

BEGIN;

ALTER TABLE aa.users
ADD COLUMN is_admin boolean;

UPDATE aa.users
SET is_admin = false;

ALTER TABLE aa.users
ALTER COLUMN is_admin SET DEFAULT false;

ALTER TABLE aa.users
ALTER COLUMN is_admin SET NOT NULL;

COMMIT;
