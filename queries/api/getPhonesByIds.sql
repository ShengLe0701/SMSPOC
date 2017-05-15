SELECT
  guests.phone as guestPhone,
  accounts.phone as accountPhone
FROM
  aa.guests JOIN aa.accounts ON accounts.id = guests.account_id
WHERE
  guests.id = ${guestId}
  AND accounts.id = ${accountId}
