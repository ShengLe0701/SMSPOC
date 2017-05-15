INSERT INTO aa.canned_messages (
  account_id,
  user_id,
  title,
  message,
  active,
  type
)
VALUES (
  ${accountId},
  ${userId},
  ${title},
  ${message},
  ${active},
  ${type}
)
RETURNING *
