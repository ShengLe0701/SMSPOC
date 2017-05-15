-- Deploy smspoc:phone-accounts to pg

BEGIN;

ALTER TABLE aa.accounts
ADD COLUMN forwarding_phone text CHECK (forwarding_phone ~* '^\+[[:digit:]]{3,100}$');

COMMIT;
