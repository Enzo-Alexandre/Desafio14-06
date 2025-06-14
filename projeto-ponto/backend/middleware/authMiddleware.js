const jwt = require('jsonwebtoken');

// Middleware para verificar se o usuário está autenticado
function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // Formato "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    // Verifica se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adiciona os dados do usuário (id, perfil) à requisição
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token inválido.' });
  }
}

// Middleware para verificar se o usuário é um administrador
function adminOnly(req, res, next) {
    if (req.user.perfil !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado. Requer perfil de administrador.' });
    }
    next();
}

module.exports = { authMiddleware, adminOnly };