ALTER TABLE "Document" ADD COLUMN "preview" TEXT;

-- Existing rows are backfilled here rather than left to be filled in on the
-- next save, which for a document nobody edits again would be never — and a
-- missing preview means a blank thumbnail.
--
-- `pg_input_is_valid` guards the cast: `data` is always written by
-- JSON.stringify, but one unparseable row would otherwise fail the migration
-- for every document.
UPDATE "Document"
SET "preview" = jsonb_build_object(
  'type', 'doc',
  'content', COALESCE(
    (
      SELECT jsonb_agg(node)
      FROM (
        SELECT node
        FROM jsonb_array_elements(("data"::jsonb) -> 'content') AS node
        LIMIT 10
      ) trimmed
    ),
    '[]'::jsonb
  )
)::text
WHERE NULLIF("data", '') IS NOT NULL
  AND pg_input_is_valid("data", 'jsonb');
