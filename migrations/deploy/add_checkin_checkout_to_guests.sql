-- Deploy smspoc:add_checkin_checkout_to_guests to pg

BEGIN;

ALTER TABLE aa.guests
ADD COLUMN checkin_at timestamp with time zone;

ALTER TABLE aa.guests
ADD COLUMN checkout_at timestamp with time zone;

COMMIT;
