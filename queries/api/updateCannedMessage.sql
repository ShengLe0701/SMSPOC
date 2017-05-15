UPDATE
  aa.canned_messages
SET
  title = ${title},
  message = ${message},
  active = ${active},
  type = ${type}
WHERE
  id = ${id} AND
  account_id = ${accountId}
RETURNING *
