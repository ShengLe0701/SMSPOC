-- Verify smspoc:guests-is-verified on pg
BEGIN;

SELECT is_verified FROM aa.guests WHERE false;

ROLLBACK;
