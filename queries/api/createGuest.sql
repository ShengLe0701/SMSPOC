INSERT INTO aa.guests (
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
)
VALUES (
  ${accountId},
  ${name},
  ${email},
  ${phone},
  ${room},
  ${note},
  true,
  ${checkinAt},
  ${checkoutAt},
  false
)
RETURNING *
