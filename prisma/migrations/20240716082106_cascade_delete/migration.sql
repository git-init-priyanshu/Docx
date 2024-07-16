-- DropForeignKey
ALTER TABLE "UserOnDocument" DROP CONSTRAINT "UserOnDocument_documentId_fkey";

-- AddForeignKey
ALTER TABLE "UserOnDocument" ADD CONSTRAINT "UserOnDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
