INSERT INTO aa.job_queue (
  account_id,
  user_id,
  delivery_method,
  payload,
  scheduled_at,
  type
)
VALUES (
  ${accountId},
  ${userId},
  ${deliveryMethod},
  ${payload},
  ${scheduledAt},
  ${type}
)
RETURNING *
