const express = require('express');
const bcrypt = require('bcrypt');
const Funcionario = require('../models/funcionario');
const RegistroPonto = require('../models/registroPonto');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
const PDFDocument = require('pdfkit');
const router = express.Router();

// Middleware para proteger todas as rotas de admin
router.use(authMiddleware, adminOnly);

// Rota para cadastrar um novo funcionário: POST /api/admin/funcionarios
router.post('/funcionarios', async (req, res) => {
    const { matricula, nome_completo, senha } = req.body;

    if (!matricula || !nome_completo || !senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    try {
        //const senha_hash = await bcrypt.hash(senha, 10);
        const senha_hash = senha;
        const novoFuncionario = await Funcionario.create({
            matricula,
            nome_completo,
            senha_hash,
            perfil: 'funcionario' // Perfil padrão
        });
        res.status(201).json({ message: 'Funcionário cadastrado com sucesso!', funcionario: novoFuncionario });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Matrícula já existe.' });
        }
        res.status(500).json({ message: 'Erro ao cadastrar funcionário', error: error.message });
    }
});

// Rota para gerar relatório em PDF: GET /api/admin/relatorio/dia
router.get('/relatorio/dia', async (req, res) => {
    const hoje = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo"})).toISOString().slice(0, 10);
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio_ponto_${hoje}.pdf`);

    doc.pipe(res);

    // Cabeçalho do PDF
    doc.fontSize(18).text(`Relatório de Ponto - ${new Date(hoje).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}`, { align: 'center' });
    doc.moveDown();

    // Cabeçalho da tabela
    const yPos = doc.y;
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Matrícula', 50, yPos);
    doc.text('Nome', 120, yPos);
    doc.text('Ent. Manhã', 280, yPos);
    doc.text('Saí. Manhã', 350, yPos);
    doc.text('Ent. Tarde', 420, yPos);
    doc.text('Saí. Tarde', 490, yPos);
    doc.font('Helvetica');
    doc.moveDown();
    
    const todosFuncionarios = await Funcionario.findAll({ where: { perfil: 'funcionario' }, order: [['nome_completo', 'ASC']] });
    
    for (const func of todosFuncionarios) {
        const registros = await RegistroPonto.findAll({ where: { funcionario_id: func.id, data_registro: hoje } });
        
        const pontos = {
            entrada_manha: registros.find(r => r.tipo_registro === 'entrada_manha')?.horario_registro || 'PENDENTE',
            saida_manha: registros.find(r => r.tipo_registro === 'saida_manha')?.horario_registro || 'PENDENTE',
            entrada_tarde: registros.find(r => r.tipo_registro === 'entrada_tarde')?.horario_registro || 'PENDENTE',
            saida_tarde: registros.find(r => r.tipo_registro === 'saida_tarde')?.horario_registro || 'PENDENTE'
        };

        const currentY = doc.y;
        doc.fontSize(9);
        doc.text(func.matricula, 50, currentY, { width: 60 });
        doc.text(func.nome_completo, 120, currentY, { width: 150 });
        doc.text(pontos.entrada_manha, 280, currentY, { width: 60 });
        doc.text(pontos.saida_manha, 350, currentY, { width: 60 });
        doc.text(pontos.entrada_tarde, 420, currentY, { width: 60 });
        doc.text(pontos.saida_tarde, 490, currentY, { width: 60 });
        doc.moveDown();
    }
    
    doc.end();
});

module.exports = router;