-- Revert smspoc:subscriptions from pg

BEGIN;

DROP TABLE aa.subscriptions;

COMMIT;
