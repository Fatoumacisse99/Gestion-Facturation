import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Accès non autorisé. Token requis ou mal formé.' });
  }

  const token = authHeader.split(' ')[1]; 
  if (!token) {
    return res.status(401).json({ message: 'Token non fourni.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      const message = err.name === 'TokenExpiredError' 
        ? 'Le token a expiré.' 
        : 'Token invalide.';
      return res.status(403).json({ message });
    }

    req.user = user;
    next();
  });
};

export const authorizeRole = (roles) => {
  return (req, res, next) => {
    console.log("Rôle utilisateur :", req.user.role);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès interdit : Vous n'êtes pas autorisé à effectuer cette action." });
    }
    next();
  };
};