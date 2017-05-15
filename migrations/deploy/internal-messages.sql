-- Deploy smspoc:internal-messages to pg
BEGIN;

ALTER TABLE aa.messages
ALTER COLUMN guest_id
DROP NOT NULL;

COMMIT;
