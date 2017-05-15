DELETE FROM
  aa.canned_messages
WHERE
  id = ${id} AND
  account_id = ${accountId}
