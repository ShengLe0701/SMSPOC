-- Revert smspoc:messages-upload from pg

BEGIN;

ALTER TABLE aa.messages
DROP COLUMN upload_key;

ALTER TABLE aa.messages
DROP COLUMN upload_url;

ALTER TABLE aa.messages
DROP COLUMN upload_name;

UPDATE aa.messages
SET body = ''
WHERE body IS NULL;

ALTER TABLE aa.messages
ALTER COLUMN body
SET NOT NULL;

COMMIT;
