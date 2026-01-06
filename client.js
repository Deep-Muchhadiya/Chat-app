// const { Server } = require("socket.io");
// const io = new Server(server, { /* options */ });

import { io } from "https://cdn.socket.io/4.5.4/socket.io.esm.min.js";
const socket = io("https://chat-app-ihi9.onrender.com");


// const socket = io('http://localhost:8000');

const form = document.getElementById('form');
const msgInp = document.querySelector('.msgInp');
const container = document.querySelector(".container");
var audio = new Audio('ting.mp3');

function scrollToBottom(){
    container.scrollTop = container.scrollHeight;
}

const append = (message, position) => {
    const newEle = document.createElement('div');
    newEle.innerText = message;
    newEle.classList.add('msg');
    newEle.classList.add(position);
    container.append(newEle);
    if(position == 'left'){
        audio.play();
    }
    scrollToBottom();
}

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = msgInp.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    msgInp.value = '';
})

const name = prompt("Enter your name to join:");
if (name) {
    socket.emit('new-user-joined', name);

    socket.on('user-joined', name => {
        append(`${name} joined the chat`, 'left');
    })

    socket.on('receive', data => {
        append(`${data.name}: ${data.message}`, "left");
    })

    socket.on('left', name => {
        append(`${name} left the chat`, 'left');
    })
}