const db = require('../database/index');
const jwt = require('jsonwebtoken');

const secretKey = 'yurk-do';

const decodeToken = require('jwt-decode');

class authUserController {
  login(req, res) {
    db.users.find(
      {
        $and: [
          { username: req.body.username },
          { password: req.body.password },
        ],
      },
      (error, users) => {
        if (users.length) {
          const user = users[0];
          const token = jwt.sign(
            {
              username: user.username,
              userId: user['_id'],
              userStatus: user.userStatus,
            },
            secretKey,
            { expiresIn: 60 * 60 }
          );

          res.status(200).json({
            token: `Bearer ${token}`,
          });
        } else {
          res.status(401).json({
            message: 'Неверное имя пользователя либо пароль',
          });
          console.log('user not Auth');
        }
      }
    );
  }

  async register(req, res) {
    db.users.find({ username: req.body.username }, (error, users) => {
      if (users.length) {
        console.log(users);
        res.status(409).json({
          message: 'Пользователь с таким именем уже существует',
        });
      } else {
        const user = {
          username: req.body.username,
          password: req.body.password,
          userStatus: req.body.userStatus,
        };
        db.users.insert(user, (error, newUser) => {
          if (!error) {
            res
              .status(201)
              .json({ message: 'Пользователь успешно зарегистрирован' });
          } else {
            console.log('user not insert');
          }
        });
      }
    });
  }

  auth(req, res) {
    if (!req.headers.authorization) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
    }

    const userId = decodeToken(req.headers.authorization).userId;

    db.users.find({ _id: userId }, (error, users) => {
      if (users.length) {
        const user = users[0];
        const token = jwt.sign(
          {
            username: user.username,
            userId: user['_id'],
            userStatus: user.userStatus,
          },
          secretKey,
          { expiresIn: 60 * 60 }
        );

        res.status(200).json({
          token: `Bearer ${token}`,
        });
        console.log(token);
      } else {
        res.status(401).json({
          message: 'Неверное имя пользователя либо пароль',
        });
        console.log('user not Auth');
      }
    });
  }
}

module.exports = new authUserController();
