-- Deploy smspoc:message-user-ids to pg
BEGIN;

ALTER TABLE aa.messages
ADD COLUMN sender_id bigint REFERENCES aa.users(id);

ALTER TABLE aa.messages
ADD COLUMN receiver_id bigint REFERENCES aa.users(id);

COMMIT;
