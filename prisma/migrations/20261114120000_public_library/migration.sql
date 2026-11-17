ALTER TYPE "DocumentSource" ADD VALUE 'WIKIPEDIA';

ALTER TABLE "Document" ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Document" ADD COLUMN "sourceUrl" TEXT;

ALTER TABLE "AiUsage" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "AiUsage" ADD COLUMN "visitorKey" TEXT;

CREATE INDEX "AiUsage_visitorKey_createdAt_idx" ON "AiUsage"("visitorKey", "createdAt");
CREATE INDEX "AiUsage_createdAt_idx" ON "AiUsage"("createdAt");
