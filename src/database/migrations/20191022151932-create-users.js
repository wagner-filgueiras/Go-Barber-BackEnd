// yarn sequelize db:migrate == to create the table on database
// sequelizeMeta -  store all the migrations delivered to the database
// yarn sequelize db:migrate:undo == undo the last migration "undo:all" == undo all migrations

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      // create a new table using Sequelize structure
      // define the colums
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      provider: {
        // the usr can be the client or the provider to schedule an appointment
        type: Sequelize.BOOLEAN,
        defaultValue: false, // by default all users are the client
        allowNull: false,
      },
      created_at: {
        // creation registry date
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        // updated registry date
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('users');
  },
};
