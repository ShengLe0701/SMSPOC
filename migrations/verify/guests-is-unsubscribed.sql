-- Verify smspoc:guests-is-unsubscribed on pg
BEGIN;

SELECT is_unsubscribed FROM aa.guests WHERE false;

ROLLBACK;
