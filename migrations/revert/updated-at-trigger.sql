-- Revert smspoc:updated-at-trigger from pg

BEGIN;

DROP TRIGGER set_updated_at ON aa.canned_messages;

COMMIT;
