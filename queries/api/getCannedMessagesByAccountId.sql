SELECT
  id,
  account_id,
  user_id,
  title,
  message,
  created_at,
  updated_at,
  active,
  type
FROM
  aa.canned_messages
WHERE
  account_id = $1
