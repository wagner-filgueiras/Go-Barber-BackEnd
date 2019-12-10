import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        // calling the method init from class Model
        // call the colums that will be used in this process
        // The  first parameter on the super.init is an object containing all the user values
        // These fields dowm here doesn't have to be a mirror of the database fields (o usuário vai preenceher mas pode chegar o dado com nome de outro campo no banco de dados)
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.path}`; // this se refere as variaveis de name e path
          },
        },
      },
      {
        sequelize, // this is the second parameter
      }
    );

    return this;
  }
}

export default File;
