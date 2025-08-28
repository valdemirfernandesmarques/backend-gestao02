const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  // Espera o formato: "Bearer tokenAqui"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token inválido ou ausente" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Salva os dados do usuário no request
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }
};
