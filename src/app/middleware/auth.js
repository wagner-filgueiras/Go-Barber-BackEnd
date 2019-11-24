import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' '); // [, token] using only the second position of the array. Discarding the first position (Bearer)

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id; // include the ID that is comming from the token

    return next();
  } catch (err) {
    return res.status(400).json({ error: 'Token invalid' });
  }
};
