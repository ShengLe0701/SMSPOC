-- Revert smspoc:jobs from pg

BEGIN;

DROP TABLE aa.job_queue;

COMMIT;
