SELECT
  guests.id,
  guests.account_id,
  guests.name,
  guests.email,
  guests.phone,
  guests.room,
  guests.note,
  guests.is_verified,
  guests.is_unsubscribed,
  guests.checkin_at,
  guests.checkout_at,
  guests.is_archived
FROM
  aa.guests JOIN aa.accounts ON accounts.id = guests.account_id
WHERE
  guests.phone = ${guestPhone}
  AND accounts.phone = ${accountPhone}
