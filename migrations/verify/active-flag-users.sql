-- Verify smspoc:active-flag-users on pg

BEGIN;

SELECT is_active
FROM aa.users
WHERE false;

ROLLBACK;
