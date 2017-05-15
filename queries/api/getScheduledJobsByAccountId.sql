SELECT
  id,
  account_id,
  user_id,
  delivery_method,
  payload,
  scheduled_at
FROM
  aa.job_queue
WHERE
  account_id = $1
