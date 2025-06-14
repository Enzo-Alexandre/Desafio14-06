const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Funcionario = require('../models/funcionario');
const router = express.Router();

// Rota de Login: POST /api/auth/login
router.post('/login', async (req, res) => {
  const { matricula, senha } = req.body;
  
  if (!matricula || !senha) {
    return res.status(400).json({ message: 'Matrícula e senha são obrigatórios.' });
  }

  const funcionario = await Funcionario.findOne({ where: { matricula } });
  if (!funcionario) {
    return res.status(404).json({ message: 'Matrícula não encontrada.' });
  }

  //const senhaValida = await bcrypt.compare(senha, funcionario.senha_hash);
  const senhaValida = (senha === funcionario.senha_hash);
  if (!senhaValida) {
    return res.status(401).json({ message: 'Senha inválida.' });
  }

  // Se chegou aqui, o login é válido. Gerar o token JWT.
  const token = jwt.sign(
    { id: funcionario.id, matricula: funcionario.matricula, perfil: funcionario.perfil },
    process.env.JWT_SECRET,
    { expiresIn: '8h' } // Token expira em 8 horas
  );

  res.json({ token, perfil: funcionario.perfil, nome: funcionario.nome_completo });
});

module.exports = router;