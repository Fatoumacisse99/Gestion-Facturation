import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Créer un utilisateur admin avec l'email cfama673@gmail.com
    const admin = await prisma.utilisateur.create({
      data: {
        nom: 'Admin User',
        email: 'cfama673@gmail.com', // Utilisez l'email demandé
        mot_de_passe: hashedPassword,
        role: 'ADMIN', // Rôle ADMIN
        statut: 'actif', // Statut actif
      },
    });

    console.log('Utilisateur admin créé :', admin);
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur :', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
