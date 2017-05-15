-- Verify smspoc:subscriptions on pg

BEGIN;

SELECT
  id,
  account_id,
  stripe_plan_id,
  active_until,
  stripe_customer_id,
  stripe_subscription_id,
  stripe_card_brand,
  stripe_card_digits
FROM
  aa.subscriptions
WHERE
  false;

ROLLBACK;
