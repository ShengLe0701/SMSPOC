UPDATE
  aa.guests
SET
  is_unsubscribed = false
WHERE
  phone = $1
RETURNING *
