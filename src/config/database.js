// this file will accessed by our application and the sequelize cli
// Set all the details for the database connection
module.exports = {
  dialect: 'postgres', // sequelize has support for other dialects also as MySql...etc
  host: '192.168.99.100',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  define: {
    timestamps: true,
    underscored: true, // use the nomenclature of tables and colums with underscore not camelcase model
    underscoredAll: true, // vai usar o padrão de nome de tabelas e colunas com underscore
  },
};
