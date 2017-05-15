UPDATE
  aa.subscriptions
SET
  active_until = now() + interval '1 month 2 days',
  stripe_customer_id = ${stripeCustomerId},
  stripe_subscription_id = ${stripeSubscriptionId},
  stripe_card_brand = ${stripeCardBrand},
  stripe_card_digits = ${stripeCardDigits}
WHERE
  account_id = ${accountId}
RETURNING *
