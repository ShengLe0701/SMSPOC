-- Deploy smspoc:rooms to pg

BEGIN;

CREATE TABLE aa.rooms (
  id bigserial PRIMARY KEY,
  account_id bigint NOT NULL REFERENCES aa.accounts(id),
  number text NOT NULL,
  code text NOT NULL
);

CREATE INDEX rooms_number_index
ON aa.rooms(account_id, number);

CREATE INDEX rooms_code_index
ON aa.rooms(account_id, code);

COMMIT;
