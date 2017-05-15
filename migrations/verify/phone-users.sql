-- Verify smspoc:phone-users on pg

BEGIN;

SELECT phone
FROM aa.users
WHERE false;

ROLLBACK;
