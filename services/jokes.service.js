const config = require('config');
const jokesUrl = config.get('jokesUrl');
const axios = require('axios');
const db = require('../database/index');

class JokesService {
  changeJokesSatus(jokesId, socket, extractJokesFromStore) {
    async function changeStatus() {
      db.jokes.update(
        { _id: jokesId },
        { $set: { status: 'ready' } },
        {},
        (error, numReplaced) => {
          if (!error) {
            console.log(numReplaced);
            extractJokesFromStore(socket);
          } else {
            console.log(error);
          }
        }
      );
      db.jokes.remove(
        { $and: [{ _id: jokesId }, { status: 'pending' }] },
        {},
        function (err, numRemoved) {
          if (!err) {
            console.log('removed ' + numRemoved + ' records');
          } else {
            console.log('element for remove not find');
          }
        }
      );
    }
    setTimeout(changeStatus, 5000);
  }

  async addJokesToStore(quantity, socket) {
    const data = await axios.get(`${jokesUrl}/${quantity}`);
    const jokesData = data.data.value;
    const jokesObjStore = {
      status: 'pending',
      jokes: [],
      jokesQuantity: quantity,
    };
    jokesData.forEach((jokesObj) => jokesObjStore.jokes.push(jokesObj.joke));
    db.jokes.insert(jokesObjStore, (error, newJokesObjStore) => {
      if (!error) {
        console.log('joke insert to database');
        this.changeJokesSatus(
          newJokesObjStore['_id'],
          socket,
          this.extractJokesFromStore
        );
      } else {
        console.log('joke not insert');
      }
    });
  }

  extractJokesFromStore(socket) {
    db.jokes.find({}, (error, jokesFromStore) => {
      if (!error) {
        console.log('extract from database');
        socket.emit('extractJokes', jokesFromStore);
      } else {
        console.log('not extract from databse ');
      }
    });
  }

  deleteJokesFromStore(jokesId, socket) {
    db.jokes.remove({ _id: jokesId }, {}, (err, numRemoved) => {
      if (!err) {
        console.log('removed ' + numRemoved + ' records');
        this.extractJokesFromStore(socket);
      } else {
        console.log('element for remove not find');
      }
    });
  }
}

module.exports = new JokesService();
