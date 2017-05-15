-- Revert smspoc:rooms from pg

BEGIN;

DROP INDEX aa.rooms_number_index;
DROP INDEX aa.rooms_code_index;
DROP TABLE aa.rooms;

COMMIT;
