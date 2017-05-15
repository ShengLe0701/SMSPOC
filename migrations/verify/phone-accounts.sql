-- Verify smspoc:phone-accounts on pg

BEGIN;

SELECT forwarding_phone
FROM aa.accounts
WHERE false;

ROLLBACK;
