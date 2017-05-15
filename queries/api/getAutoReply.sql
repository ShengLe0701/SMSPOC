SELECT
  message,
  accounts.phone as phone_from,
  guests.phone as phone_to,
  canned_messages.user_id as sender_id
FROM
  aa.accounts
  JOIN aa.guests ON guests.account_id = accounts.id
  JOIN aa.canned_messages ON accounts.id = canned_messages.account_id
WHERE
  guests.account_id = ${accountId}
  AND guests.id = ${id}
  AND canned_messages.type = 1
  AND canned_messages.active
LIMIT 1
