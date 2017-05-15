-- Revert smspoc:canned-messages from pg

BEGIN;

DROP INDEX aa.canned_messages_account_user_index;
DROP TABLE aa.canned_messages;

COMMIT;
