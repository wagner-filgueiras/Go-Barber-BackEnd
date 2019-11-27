import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        // calling the method init from class Model
        // call the colums that will be used in this process
        // The  first parameter on the super.init is an object containing all the user values
        // These fields dowm here doesn't have to be a mirror of the database fields (o usuário vai preenceher mas pode chegar o dado com nome de outro campo no banco de dados)
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // This field will never exists on the database.
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize, // this is the second parameter
      }
    );

    // Hooks são trechos de códigos que executam automaticamente
    // baseado em ações que ocorrem em nosso model
    this.addHook('beforeSave', async user => {
      // before any user be saved on the database this code snipet will run
      // user.name = 'Diego'; THIS IS AN EXAMPLE - where no matter what user input on the name field, the user name will alaways be recorded as 'Diego'
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
        // 8 é o numero de rounds de criptografia , a força da criptografia.
      }
    });

    return this;
    // retorna o modulo que foi inicialiazado dentro desse hook
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' }); // Relaciona a tabela de Files com a tabela Users através do avatar_id
    // Salva a referência de um id de arquivo dentro da tabela de usuários
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
