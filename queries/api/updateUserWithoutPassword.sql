UPDATE
  aa.users
SET
  name = ${name},
  email = ${email},
  is_admin = ${isAdmin},
  is_active = ${isActive},
  phone = ${phone}
WHERE
  id = ${id}
  AND account_id = ${accountId}
RETURNING id, name, email, account_id, is_admin, is_active, phone
