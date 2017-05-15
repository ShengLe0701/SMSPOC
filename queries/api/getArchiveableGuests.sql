SELECT
  id,
  account_id,
  name,
  email,
  phone,
  room,
  note,
  is_verified,
  checkin_at,
  checkout_at,
  is_archived
FROM
  aa.guests
WHERE
  is_archived = false
  AND (select checkout_at + interval '12 hours') <= now()

