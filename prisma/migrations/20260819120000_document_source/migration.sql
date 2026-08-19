CREATE TYPE "DocumentSource" AS ENUM ('BLANK', 'GOOGLE_DOCS');

-- Existing rows keep the default. Imports before this column are not
-- recoverable after the fact: nothing was recorded at the time that
-- distinguishes them from a document someone typed.
ALTER TABLE "Document" ADD COLUMN "source" "DocumentSource" NOT NULL DEFAULT 'BLANK';
