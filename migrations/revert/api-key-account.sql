-- Revert smspoc:api-key-account from pg

BEGIN;

ALTER TABLE aa.accounts
DROP COLUMN api_key;

COMMIT;
