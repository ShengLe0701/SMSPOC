-- Deploy smspoc:accounts-name to pg

BEGIN;

ALTER TABLE aa.accounts
ADD COLUMN name text;

COMMIT;
