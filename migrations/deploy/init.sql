-- Deploy smspoc:init to pg
BEGIN;

CREATE SCHEMA aa;

-- An 'account' is a property (hotel, etc.) account.
CREATE TABLE aa.accounts (
  id bigserial PRIMARY KEY,
  phone text NOT NULL UNIQUE CHECK (phone ~* '^\+[[:digit:]]{3,100}$')
);

-- Hotel employees table used by the authentication service.
CREATE TABLE aa.users (
  id bigserial PRIMARY KEY,
  email text NOT NULL UNIQUE CHECK (email ~* '^.+@.+\..+$'),
  password text NOT NULL CHECK (length(password) < 512),
  account_id bigint NOT NULL REFERENCES aa.accounts(id),
  name text NOT NULL CHECK (length(name) > 0)
);

-- We'll want to fetch all the employees of a given account.
CREATE INDEX users_account_id_index
ON aa.users(account_id);

-- Lowercase emails on insert or update.
CREATE FUNCTION aa.lowercase_email() RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $$
BEGIN
  new.email = lower(new.email);
  RETURN new;
END
$$;

CREATE TRIGGER lowercase_email
BEFORE INSERT OR UPDATE ON aa.users
FOR EACH ROW
EXECUTE PROCEDURE aa.lowercase_email();

CREATE TABLE aa.guests (
  id bigserial PRIMARY KEY,
  account_id bigint NOT NULL REFERENCES aa.accounts(id),
  phone text NOT NULL CHECK (phone ~* '^\+[[:digit:]]{3,100}$'),
  name text,
  email text,
  room text,
  note text
);

-- Guests have unique phone numbers inside one hotel.
CREATE UNIQUE INDEX guests_account_phone_index
ON aa.guests (account_id, phone);

-- Every message has guest_id and account_id. Direction is a enum
-- that determines whether the message was sent by the hotel or the guest.
CREATE TABLE aa.messages (
  id bigserial PRIMARY KEY,
  direction int NOT NULL,
  guest_id bigint NOT NULL REFERENCES aa.guests(id),
  account_id bigint NOT NULL REFERENCES aa.accounts(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  body text NOT NULL
);

CREATE INDEX messages_sender_id_index
ON aa.messages(guest_id);

CREATE INDEX messages_receiver_id_index
ON aa.messages(account_id);

COMMIT;
