import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('userDisconnect', socket.id);
  });

  socket.on('sendLocation', (location) => {
    io.emit('receiveLocation', {id : socket.id, ...location});
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
