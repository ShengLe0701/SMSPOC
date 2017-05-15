UPDATE
  aa.guests
SET
  is_unsubscribed = true
WHERE
  phone = $1
RETURNING *
