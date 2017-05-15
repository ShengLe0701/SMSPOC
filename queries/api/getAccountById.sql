SELECT
  phone,
  forwarding_phone,
  timezone,
  api_key
FROM
  aa.accounts
WHERE
  id = $1
