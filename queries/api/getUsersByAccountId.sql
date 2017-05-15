SELECT
  id,
  account_id,
  name,
  email,
  is_admin,
  is_active,
  phone
FROM
  aa.users
WHERE
  account_id = $1
