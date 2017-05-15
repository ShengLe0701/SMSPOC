UPDATE
  aa.accounts
SET
  api_key = ${apiKey},
  forwarding_phone = ${forwardingPhone}
WHERE
  id = ${id}
RETURNING *
