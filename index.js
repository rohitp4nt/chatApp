const http = require("http");
const express = require("express");
const path = require("path");
const app = express();
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);

let userCount = 0; // Count how many users are connected
let users = {};    // Store user assignments based on socket ID

io.on('connection', (socket) => {
    // Assign user based on connection order
    if (!users[socket.id]) {
        users[socket.id] = userCount === 0 ? "User 1" : "User 2";
        userCount++;
    }

    // Listen for incoming messages
    socket.on('user-message', (message) => {
        const user = users[socket.id]; // Get the user based on socket ID
        io.emit('message', { user, message }); // Broadcast message to all connected clients
    });

    // Handle user disconnecting
    socket.on('disconnect', () => {
        userCount--; // Decrease user count
        delete users[socket.id]; // Remove user from list
        console.log("user dissconnected");
    });
});

// Serve the static files (e.g., HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

server.listen(3000, () => console.log("Server started on port 3000"));
