import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          },
          /* Vou tirar duas horas da data do agendamento e verificando se o
               horário atual ainda é antes desse resultado menos duas horas.
               Isso para a regra de que um agendamento só pode ser cancelado
               com pelo menos duas horas de antecedência */
        },
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
