
const express = require("express"); 
const http = require("http"); 
const { Server } = require("socket.io"); 
const cors = require("cors"); 
const app = express();
app.use(cors({ origin: "*" })); 
const server = http.createServer(app); 
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        console.log("user joined", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    })

    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    })

    socket.on('disconnect', ()=> {
        if(users[socket.id] == null || users[socket.id] == undefined){
            return;
        }
        socket.broadcast.emit('left', users[socket.id]);
        console.log(`${users[socket.id]} left`);
        delete users[socket.id];
    })
})

server.listen(3000);