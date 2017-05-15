UPDATE
  aa.subscriptions
SET
  stripe_card_brand = ${stripeCardBrand},
  stripe_card_digits = ${stripeCardDigits}
WHERE
  stripe_customer_id = ${stripeCustomerId}
RETURNING *
