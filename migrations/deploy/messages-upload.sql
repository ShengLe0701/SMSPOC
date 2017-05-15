-- Deploy smspoc:messages-upload to pg

BEGIN;

ALTER TABLE aa.messages
ADD COLUMN upload_key text;

ALTER TABLE aa.messages
ADD COLUMN upload_url text;

ALTER TABLE aa.messages
ADD COLUMN upload_name text;

ALTER TABLE aa.messages
ALTER COLUMN body
DROP NOT NULL;

COMMIT;
