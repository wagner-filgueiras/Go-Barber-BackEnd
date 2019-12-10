// this file will accessed by our application and the sequelize cli
// Set all the details for the database connection
require('dotenv').config();

module.exports = {
  dialect: 'postgres', // sequelize has support for other dialects also as MySql...etc
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
    underscored: true, // use the nomenclature of tables and colums with underscore not camelcase model
    underscoredAll: true, // vai usar o padrão de nome de tabelas e colunas com underscore
  },
};
