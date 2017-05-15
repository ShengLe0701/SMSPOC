SELECT
  id,
  password,
  email,
  account_id,
  is_admin,
  is_active
FROM
  aa.users
WHERE
  email = $1
