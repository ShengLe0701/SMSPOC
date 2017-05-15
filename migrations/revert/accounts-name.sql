-- Revert smspoc:accounts-name from pg

BEGIN;

ALTER TABLE aa.accounts
DROP COLUMN name;

COMMIT;
