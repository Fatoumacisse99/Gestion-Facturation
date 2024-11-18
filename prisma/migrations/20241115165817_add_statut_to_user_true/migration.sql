/*
  Warnings:

  - The `statut` column on the `Utilisateur` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Utilisateur" DROP COLUMN "statut",
ADD COLUMN     "statut" BOOLEAN NOT NULL DEFAULT true;
