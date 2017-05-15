INSERT INTO aa.guests (
  account_id,
  phone,
  is_verified,
  is_archived
)
VALUES (
  (SELECT id FROM aa.accounts WHERE phone = ${accountPhone} LIMIT 1),
  ${guestPhone},
  false,
  false
)
RETURNING *
