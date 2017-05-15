SELECT
  id,
  account_id,
  number,
  code
FROM
  aa.rooms
WHERE
  account_id = ${accountId}
  AND code = ${code}
