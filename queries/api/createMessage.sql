INSERT INTO aa.messages (
  guest_id,
  account_id,
  direction,
  body,
  sender_id,
  receiver_id,
  upload_url,
  upload_key,
  upload_name
)
VALUES (
  ${guestId},
  ${accountId},
  ${direction},
  ${body},
  ${senderId},
  ${receiverId},
  ${uploadUrl},
  ${uploadKey},
  ${uploadName}
)
RETURNING *
