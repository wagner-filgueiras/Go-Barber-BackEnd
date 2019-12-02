import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize, // this is the second parameter
      }
    );

    return this;
  }

  // Creating relationship between tables
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' }); // as da o apelido ao relacionamento
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
