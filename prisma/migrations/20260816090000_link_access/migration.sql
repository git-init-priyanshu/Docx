CREATE TYPE "LinkAccess" AS ENUM ('NONE', 'EDIT');

ALTER TABLE "Document" ADD COLUMN "linkAccess" "LinkAccess" NOT NULL DEFAULT 'NONE';

-- Documents that predate this column were reachable by anyone holding their
-- link, because opening one joined the caller as a collaborator. Defaulting
-- them to NONE would silently break links already shared with other people,
-- so existing rows keep the access they effectively had. New documents are
-- private until explicitly shared.
UPDATE "Document" SET "linkAccess" = 'EDIT';
