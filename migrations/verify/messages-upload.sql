-- Verify smspoc:messages-upload on pg

BEGIN;

SELECT upload_key, upload_name, upload_url
FROM aa.messages
WHERE false;

ROLLBACK;
