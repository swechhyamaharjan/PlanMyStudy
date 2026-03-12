/*
  Warnings:

  - Added the required column `subjectId` to the `StudyTask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudyTask" ADD COLUMN     "subjectId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "StudyTask" ADD CONSTRAINT "StudyTask_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
