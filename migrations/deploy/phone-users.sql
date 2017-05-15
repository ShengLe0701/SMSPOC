-- Deploy smspoc:phone-users to pg

BEGIN;

ALTER TABLE aa.users
ADD COLUMN phone text CHECK (phone ~* '^\+[[:digit:]]{3,100}$');

COMMIT;
