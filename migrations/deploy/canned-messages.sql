-- Deploy smspoc:canned-messages to pg

BEGIN;

CREATE TABLE aa.canned_messages (
  id bigserial PRIMARY KEY,
  account_id bigint NOT NULL REFERENCES aa.accounts(id),
  user_id bigint NOT NULL REFERENCES aa.users(id),
  title text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  active boolean DEFAULT FALSE
);

CREATE INDEX canned_messages_account_user_index
ON aa.canned_messages (account_id, user_id);

COMMIT;
