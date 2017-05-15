-- Verify smspoc:updated-at-trigger on pg

BEGIN;

SELECT 'aa.set_updated_at'::regproc;

ROLLBACK;
