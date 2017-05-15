SELECT DISTINCT ON (guests.id)
  guests.id,
  guests.account_id,
  guests.name,
  guests.email,
  guests.phone,
  guests.room,
  guests.note,
  guests.is_verified,
  guests.is_unsubscribed,
  messages.created_at as last_message_at,
  guests.checkin_at,
  guests.checkout_at,
  guests.is_archived
FROM
  aa.guests
LEFT JOIN
  aa.messages
ON
  guests.id = guest_id
WHERE
  guests.account_id = $1
ORDER BY
  guests.id,
  messages.created_at
  DESC
