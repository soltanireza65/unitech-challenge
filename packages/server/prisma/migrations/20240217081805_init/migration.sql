-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "latitude" INTEGER,
    "longitude" INTEGER,
    "category" TEXT,
    "counter" INTEGER,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
