-- Revert smspoc:canned-messages-type from pg

BEGIN;

ALTER TABLE aa.canned_messages
DROP COLUMN type;

COMMIT;
