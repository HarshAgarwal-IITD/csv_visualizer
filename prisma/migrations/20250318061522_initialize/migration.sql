/*
  Warnings:

  - You are about to drop the column `idA` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `ron10v` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `ron45v` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `vdss` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `vgs` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `vthMax` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `vthMaxValue` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `vthMin` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "idA",
DROP COLUMN "ron10v",
DROP COLUMN "ron45v",
DROP COLUMN "vdss",
DROP COLUMN "vgs",
DROP COLUMN "vthMax",
DROP COLUMN "vthMaxValue",
DROP COLUMN "vthMin",
ADD COLUMN     "idATA25" TEXT,
ADD COLUMN     "ron10vMax" TEXT,
ADD COLUMN     "ron4_5vMax" TEXT,
ADD COLUMN     "vdssV" TEXT,
ADD COLUMN     "vgsV" TEXT,
ADD COLUMN     "vthMaxV" TEXT,
ADD COLUMN     "vthMinV" TEXT,
ADD COLUMN     "vthVMax" TEXT;
