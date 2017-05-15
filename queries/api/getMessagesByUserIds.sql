SELECT
  id,
  guest_id,
  account_id,
  direction,
  created_at,
  body,
  sender_id,
  receiver_id,
  upload_url,
  upload_name,
  upload_key
FROM
  aa.messages
WHERE
  (sender_id = ${id1} AND receiver_id = ${id2})
  OR (sender_id = ${id2} AND receiver_id = ${id1})
ORDER BY
  created_at
