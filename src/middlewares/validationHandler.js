
const errorHandler = (err, _req, res, _next) => {
  console.error(err); // Log l'erreur pour le développement

  const status = err.status || 500; // Détermine le statut HTTP à retourner
  const message = err.message || 'Une erreur est survenue'; // Message d'erreur par défaut

  // Formate la réponse d'erreur
  res.status(status).json({
      error: {
          message: message,
          
      },
  });
};

export default errorHandler;
// app.use((err, req, res, next) => {
//   console.error(err);
//   const status = err.status || 500;
//   res.status(status).json({
//     message: err.message || "Une erreur est survenue.",
//     stack: err.stack,
//   });
// });