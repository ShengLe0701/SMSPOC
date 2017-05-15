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
  account_id = ${accountId}
  AND guest_id = ${guestId}
ORDER BY
  created_at
