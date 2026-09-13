/*
  Warnings:

  - A unique constraint covering the columns `[class_soft_id]` on the table `Class` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `class_name` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE class_class_id_seq;
ALTER TABLE "Class" ADD COLUMN     "class_name" TEXT NOT NULL,
ADD COLUMN     "class_soft_id" INTEGER,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ALTER COLUMN "class_id" SET DEFAULT nextval('class_class_id_seq');
ALTER SEQUENCE class_class_id_seq OWNED BY "Class"."class_id";

-- CreateIndex
CREATE UNIQUE INDEX "Class_class_soft_id_key" ON "Class"("class_soft_id");
