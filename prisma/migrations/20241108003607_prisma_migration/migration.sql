-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(50) NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "mot_de_passe" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModePaiement" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(50) NOT NULL,
    "id_utilisateur" INTEGER NOT NULL,

    CONSTRAINT "ModePaiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(50) NOT NULL,
    "prenom" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "telephone" VARCHAR(12) NOT NULL,
    "adresse" VARCHAR(50) NOT NULL,
    "id_utilisateur" INTEGER NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facture" (
    "id" SERIAL NOT NULL,
    "date_emission" TIMESTAMP(3) NOT NULL,
    "date_echeance" TIMESTAMP(3) NOT NULL,
    "montant" DECIMAL(15,2) NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'active',
    "id_utilisateur" INTEGER NOT NULL,
    "id_client" INTEGER NOT NULL,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" SERIAL NOT NULL,
    "date_paiement" TIMESTAMP(3) NOT NULL,
    "montant_paye" DECIMAL(15,2) NOT NULL,
    "id_mode_paiement" INTEGER NOT NULL,
    "id_utilisateur" INTEGER NOT NULL,
    "id_facture" INTEGER NOT NULL,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LigneFacture" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(50) NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prix_unitaire" DECIMAL(15,2) NOT NULL,
    "montant_ligne" DECIMAL(15,2) NOT NULL,
    "id_facture" INTEGER NOT NULL,

    CONSTRAINT "LigneFacture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ModePaiement_libelle_key" ON "ModePaiement"("libelle");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_telephone_key" ON "Client"("telephone");

-- AddForeignKey
ALTER TABLE "ModePaiement" ADD CONSTRAINT "ModePaiement_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_id_facture_fkey" FOREIGN KEY ("id_facture") REFERENCES "Facture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_id_mode_paiement_fkey" FOREIGN KEY ("id_mode_paiement") REFERENCES "ModePaiement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneFacture" ADD CONSTRAINT "LigneFacture_id_facture_fkey" FOREIGN KEY ("id_facture") REFERENCES "Facture"("id") ON DELETE CASCADE ON UPDATE CASCADE;
