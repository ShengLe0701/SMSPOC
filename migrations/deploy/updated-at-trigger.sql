-- Deploy smspoc:updated-at-trigger to pg

BEGIN;

CREATE OR REPLACE FUNCTION aa.set_updated_at() RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END
$$;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON aa.canned_messages
FOR EACH ROW
EXECUTE PROCEDURE aa.set_updated_at();

COMMIT;
