-- DropForeignKey
ALTER TABLE "Batch" DROP CONSTRAINT "Batch_teacherId_fkey";

-- CreateTable
CREATE TABLE "_TeacherBatches" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TeacherBatches_AB_unique" ON "_TeacherBatches"("A", "B");

-- CreateIndex
CREATE INDEX "_TeacherBatches_B_index" ON "_TeacherBatches"("B");

-- AddForeignKey
ALTER TABLE "_TeacherBatches" ADD CONSTRAINT "_TeacherBatches_A_fkey" FOREIGN KEY ("A") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeacherBatches" ADD CONSTRAINT "_TeacherBatches_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
