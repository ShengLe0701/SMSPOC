-- Revert smspoc:init from pg
BEGIN;

DROP INDEX aa.messages_receiver_id_index;
DROP INDEX aa.messages_sender_id_index;
DROP TABLE aa.messages;
DROP TABLE aa.guests;
DROP TRIGGER lowercase_email ON aa.users;
DROP FUNCTION aa.lowercase_email();
DROP INDEX aa.users_account_id_index;
DROP TABLE aa.users;
DROP TABLE aa.accounts;
DROP SCHEMA aa;

COMMIT;
