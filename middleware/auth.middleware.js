const jwt = require('jsonwebtoken');
const secretKey = 'yurk-do';

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split()[1];

    if (!token) {
      return res.status(401).json({ message: 'Auth error' });
    }
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Ошибка авторизации' });
  }
};
