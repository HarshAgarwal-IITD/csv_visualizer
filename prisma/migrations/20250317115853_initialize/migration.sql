-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "subCategory" TEXT NOT NULL,
    "partNumber" TEXT NOT NULL,
    "datasheetUrl" TEXT NOT NULL,
    "vdss" TEXT,
    "vgs" TEXT,
    "vthMin" TEXT,
    "vthMax" TEXT,
    "idA" TEXT,
    "vthMaxValue" TEXT,
    "ron45v" TEXT,
    "ron10v" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_partNumber_key" ON "Product"("partNumber");
