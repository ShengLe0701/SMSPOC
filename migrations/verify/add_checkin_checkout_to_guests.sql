-- Verify smspoc:add_checkin_checkout_to_guests on pg

BEGIN;

SELECT checkin_at, checkout_at
FROM aa.guests
WHERE false;

ROLLBACK;
