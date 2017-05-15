-- Verify smspoc:is-archived-flag-guests on pg

BEGIN;

SELECT is_archived
FROM aa.guests
WHERE false;

ROLLBACK;
