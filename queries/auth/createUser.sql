INSERT INTO aa.users (
  name,
  email,
  password,
  account_id,
  is_admin,
  is_active,
  phone
)
VALUES (
  ${name},
  ${email},
  ${password},
  ${accountId},
  ${isAdmin},
  ${isActive},
  ${phone}
)
RETURNING id, name, email, account_id, is_admin, is_active, phone
