const Datastore = require('nedb');
const db = {}; 
db.jokes = new Datastore({
  filename: './database/jokesData/jokes.db',
  autoload: true,
});
db.users = new Datastore({
  filename: './database/usersData/users.db',
  autoload: true,
});


module.exports = db;