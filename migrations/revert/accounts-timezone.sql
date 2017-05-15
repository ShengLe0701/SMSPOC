-- Revert smspoc:accounts-timezone from pg

BEGIN;

ALTER TABLE aa.accounts
DROP COLUMN timezone;

COMMIT;
