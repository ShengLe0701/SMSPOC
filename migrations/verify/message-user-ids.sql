-- Verify smspoc:message-user-ids on pg
BEGIN;

SELECT sender_id, receiver_id
FROM aa.messages
WHERE false;

ROLLBACK;
