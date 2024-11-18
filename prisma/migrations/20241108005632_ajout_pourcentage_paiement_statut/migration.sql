/*
  Warnings:

  - Added the required column `pourcentage_paiement` to the `Facture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Facture" ADD COLUMN     "pourcentage_paiement" INTEGER NOT NULL;
