-- Verify smspoc:jobs on pg

BEGIN;

SELECT
  id,
  account_id,
  user_id,
  delivery_method,
  payload,
  type,
  scheduled_at,
  created_at
FROM aa.job_queue WHERE false;

ROLLBACK;
