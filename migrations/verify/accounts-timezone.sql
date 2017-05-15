-- Verify smspoc:accounts-timezone on pg

BEGIN;

SELECT timezone FROM aa.accounts WHERE false;

ROLLBACK;
