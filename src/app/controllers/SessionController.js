import * as Yup from 'yup';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import File from '../models/File';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      // fields validation
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      // Pegando o schema e passando o que vem no req.body que o usuário digitou e verificando se é igual ao que foi definido no Schema em cima com YUP
      return res.status(400).json({ error: 'Validation Failed' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!user) {
      // check if the user exists
      return res.status(400).json({ error: 'User not found' });
    }
    // check if the password match using this method inside on User.js
    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ error: 'Password does not match' });
    }

    const { id, name, avatar, provider } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        provider,
        avatar,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        // put the user id on the token payload and a custom text
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
