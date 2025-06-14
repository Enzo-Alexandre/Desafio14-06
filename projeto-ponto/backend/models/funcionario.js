const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Funcionario = sequelize.define('Funcionario', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  matricula: { type: DataTypes.STRING, unique: true, allowNull: false },
  nome_completo: { type: DataTypes.STRING, allowNull: false },
  senha_hash: { type: DataTypes.STRING, allowNull: false },
  perfil: { type: DataTypes.STRING, allowNull: false, defaultValue: 'funcionario' } // 'admin' ou 'funcionario'
}, { 
  timestamps: false, 
  tableName: 'funcionarios' 
});

module.exports = Funcionario;