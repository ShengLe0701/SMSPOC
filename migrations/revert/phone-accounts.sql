-- Revert smspoc:phone-accounts from pg

BEGIN;

ALTER TABLE aa.accounts
DROP COLUMN forwarding_phone;

COMMIT;
