const express = require('express');
const RegistroPonto = require('../models/registroPonto');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

// Janelas de horário permitidas para cada registro
const janelas = {
    entrada_manha: { start: '07:45', end: '08:15' },
    saida_manha:   { start: '11:45', end: '12:15' },
    entrada_tarde: { start: '13:45', end: '14:15' },
    saida_tarde:   { start: '17:45', end: '18:15' },
};

// Rota para registrar um ponto: POST /api/ponto/registrar
router.post('/registrar', authMiddleware, async (req, res) => {
    const { tipo_registro } = req.body;
    const funcionario_id = req.user.id;

    // Obtém data e hora atuais no fuso horário de São Paulo
    const agora = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));
    const dataAtual = agora.toISOString().slice(0, 10);
    const horaAtual = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    const janela = janelas[tipo_registro];
    if (!janela || horaAtual < janela.start || horaAtual > janela.end) {
        const msg = `Fora da janela de tempo para ${tipo_registro.replace('_', ' ')} (${janela.start} - ${janela.end})`;
        return res.status(400).json({ message: msg });
    }

    const registroExistente = await RegistroPonto.findOne({
        where: { funcionario_id, data_registro: dataAtual, tipo_registro }
    });

    if (registroExistente) {
        return res.status(409).json({ message: `Você já registrou a ${tipo_registro.replace('_', ' ')} hoje.` });
    }

    try {
        const novoRegistro = await RegistroPonto.create({
            funcionario_id,
            data_registro: dataAtual,
            horario_registro: agora,
            tipo_registro
        });
        res.status(201).json({ message: 'Ponto registrado com sucesso!', registro: novoRegistro });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar ponto.', error: error.message });
    }
});

// Rota para ver os próprios registros do dia: GET /api/ponto/meus-registros-hoje
router.get('/meus-registros-hoje', authMiddleware, async (req, res) => {
    const funcionario_id = req.user.id;
    const hoje = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo"})).toISOString().slice(0, 10);

    const registros = await RegistroPonto.findAll({
        where: { funcionario_id, data_registro: hoje },
        order: [['horario_registro', 'ASC']]
    });

    res.json(registros);
});

module.exports = router;
