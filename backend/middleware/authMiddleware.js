// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ error: "Token não fornecido" });
  }

  // Formato esperado: "Bearer <token>"
  const tokenPart = token.split(" ")[1];

  try {
    const decoded = jwt.verify(tokenPart, process.env.JWT_SECRET);
    req.user = decoded; // salva os dados do usuário no request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

module.exports = verifyToken; // ✅ exporta a função diretamente
