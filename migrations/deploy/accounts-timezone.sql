-- Deploy smspoc:accounts-timezone to pg

BEGIN;

ALTER TABLE aa.accounts
ADD COLUMN timezone text DEFAULT 'America/New_York';

UPDATE aa.accounts
SET timezone = 'America/New_York';

ALTER TABLE aa.accounts
ALTER COLUMN timezone SET NOT NULL;

COMMIT;
