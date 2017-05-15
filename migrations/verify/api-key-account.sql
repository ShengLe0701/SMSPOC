-- Verify smspoc:api-key-account on pg

BEGIN;

SELECT api_key
FROM aa.accounts
WHERE false;

ROLLBACK;
