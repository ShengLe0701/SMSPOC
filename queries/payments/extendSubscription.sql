UPDATE
  aa.subscriptions
SET
  active_until = now() + interval '1 month 2 days'
WHERE
  stripe_customer_id = $1
