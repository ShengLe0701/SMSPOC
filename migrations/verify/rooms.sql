-- Verify smspoc:rooms on pg

BEGIN;

SELECT id, account_id, number, code
FROM aa.rooms
WHERE false;

ROLLBACK;
