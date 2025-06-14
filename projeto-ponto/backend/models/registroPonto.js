const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Funcionario = require('./funcionario');

const RegistroPonto = sequelize.define('RegistroPonto', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  data_registro: { type: DataTypes.DATEONLY, allowNull: false },
  horario_registro: { type: DataTypes.TIME, allowNull: false },
  tipo_registro: { type: DataTypes.STRING, allowNull: false } // 'entrada_manha', 'saida_manha', etc.
}, { 
  timestamps: false, 
  tableName: 'registrosponto' 
});

// Define a relação entre as tabelas
RegistroPonto.belongsTo(Funcionario, { foreignKey: 'funcionario_id' });
Funcionario.hasMany(RegistroPonto, { foreignKey: 'funcionario_id' });

module.exports = RegistroPonto;