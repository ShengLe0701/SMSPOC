-- Verify smspoc:canned-messages-type on pg

BEGIN;

SELECT type
FROM aa.canned_messages
WHERE false;

ROLLBACK;
