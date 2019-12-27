import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

class UserConstroller {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      // Pegando o schema e passando o que vem no req.body que o usuário digitou e verificando se é igual ao que foi definido no Schema em cima com YUP
      return res.status(400).json({ error: 'Validation Failed' });
    }

    const userExists = await User.findOne({
      where: {
        email: req.body.email, // where the email is == the data (email) coming from the body of the request.
      },
    });
    // check if the email already exist
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' }); // return an error if already exists
    }

    // Aqui você define o quais dados retornar para o front end
    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when(
        'password',
        (password, field) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field // garantindo que o campo cinfirmPassword seja igual ao campo ref Password
      ),
    });

    if (!(await schema.isValid(req.body))) {
      // Pegando o schema e passando o que vem no req.body que o usuário digitou e verificando se é igual ao que foi definido no Schema em cima com YUP
      return res.status(400).json({ error: 'Validation Failed' });
    }
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Password does not match.' });
    }

    await user.update(req.body);

    const { id, name, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }
}

export default new UserConstroller();
