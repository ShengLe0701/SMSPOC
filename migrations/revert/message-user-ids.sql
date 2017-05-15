-- Revert smspoc:message-user-ids from pg
BEGIN;

ALTER TABLE aa.messages
DROP COLUMN receiver_id;

ALTER TABLE aa.messages
DROP COLUMN sender_id;

COMMIT;
