-- Verify smspoc:accounts-name on pg

BEGIN;

SELECT name FROM aa.accounts WHERE false;

ROLLBACK;
