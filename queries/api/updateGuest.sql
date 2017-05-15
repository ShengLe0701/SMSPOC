UPDATE
  aa.guests
SET
  name = ${name},
  email = ${email},
  room = ${room},
  note = ${note},
  phone = ${phone},
  is_verified = ${isVerified},
  checkin_at = ${checkinAt},
  checkout_at = ${checkoutAt},
  is_archived = ${isArchived}
WHERE
  id = ${id}
  AND account_id = ${accountId}
RETURNING *
