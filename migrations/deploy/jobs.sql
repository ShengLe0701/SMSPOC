-- Deploy smspoc:jobs to pg

BEGIN;

CREATE TABLE aa.job_queue (
  id bigserial PRIMARY KEY,
  account_id bigint NOT NULL REFERENCES aa.accounts(id),
  user_id bigint NOT NULL REFERENCES aa.users(id),
  delivery_method text,
  payload jsonb,
  type text,
  scheduled_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMIT;
