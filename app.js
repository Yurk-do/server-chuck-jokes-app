const express = require('express');

const config = require('config');
const cors = require('cors');

const app = express();

const host = '127.0.0.1';
const port = process.env.PORT || 5000;

const http = require('http').createServer(app);

const io = require('socket.io')(http);

const JokesService = require('./services/jokes.service');

const router = require('./routes/index');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

const clients = [];

io.of('/api/jokes/chuck').on('connection', (socket) => {
  console.log(`Client with id ${socket.id} connected`);
  clients.push(socket.id);

  socket.emit('message', "I'm server");

  socket.on('getAllJokes', (message) => {
    console.log(message);
    JokesService.extractJokesFromStore(socket);
  });

  socket.on('quantity', async (quantity) => {
    if (quantity) {
      await JokesService.addJokesToStore(quantity, socket);
    }
    JokesService.extractJokesFromStore(socket);
  });

  socket.on('delete', (deleteId) => {
    if (deleteId) {
      JokesService.deleteJokesFromStore(deleteId, socket);
    }
  });

  socket.on('disconnect', () => {
    clients.splice(clients.indexOf(socket.id), 1);
    console.log(`Client with id ${socket.id} disconnected`);
  });
});

http.listen(port, host, () =>
  console.log(`Server listens http://${host}:${port}`)
);
