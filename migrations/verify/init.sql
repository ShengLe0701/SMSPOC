-- Verify smspoc:init on pg
BEGIN;

SELECT id, phone FROM aa.accounts WHERE false;
SELECT id, email, password, account_id, name FROM aa.users WHERE false;
SELECT 'aa.lowercase_email'::regproc;
SELECT id, account_id, phone, name, email, room, note FROM aa.guests WHERE false;
SELECT id, direction, guest_id, account_id, created_at, body FROM aa.messages WHERE false;

ROLLBACK;
