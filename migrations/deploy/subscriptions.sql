-- Deploy smspoc:subscriptions to pg

BEGIN;

CREATE TABLE aa.subscriptions (
  id bigserial PRIMARY KEY,
  account_id bigint UNIQUE NOT NULL REFERENCES aa.accounts(id),
  stripe_plan_id text NOT NULL,
  active_until timestamptz,
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text UNIQUE,
  stripe_card_brand text,
  stripe_card_digits text
);

COMMIT;
