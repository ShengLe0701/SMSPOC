-- Verify smspoc:canned-messages on pg

BEGIN;

SELECT id, account_id, user_id, title, message, created_at, updated_at, active FROM aa.canned_messages WHERE false;

ROLLBACK;
