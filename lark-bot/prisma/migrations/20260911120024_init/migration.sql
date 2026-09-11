-- CreateTable
CREATE TABLE "Class" (
    "class_id" INTEGER NOT NULL,
    "push_urls" TEXT[],

    CONSTRAINT "Class_pkey" PRIMARY KEY ("class_id")
);
