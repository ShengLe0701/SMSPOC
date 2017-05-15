-- Deploy smspoc:canned-messages-type to pg

BEGIN;

ALTER TABLE aa.canned_messages
ADD COLUMN type integer;

-- Type 0 is a template. See src/constants.js
UPDATE aa.canned_messages
SET type = 0;

ALTER TABLE aa.canned_messages
ALTER COLUMN type
SET NOT NULL;

COMMIT;
