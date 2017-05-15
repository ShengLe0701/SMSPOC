-- Deploy smspoc:api-key-account to pg

BEGIN;

ALTER TABLE aa.accounts
ADD COLUMN api_key text;

COMMIT;
