import { Server } from "socket.io";
import {createMessageByIDConversation} from "./src/models/Message.js";

const io = new Server();

let clients = [];

io.on("connection", (socket) => {
    console.log("connexion");
    // send a message to the client
    socket.emit("hello", "world");

    socket.on("identification", (data) => {
        socket.userId = data.userId;
        console.log(`user ${socket.userId} connected`);
        clients.push(socket);
    });

    socket.on("newMsg", (data) => {

        const client = clients.find((client) => client.userId === data.to);
        createMessageByIDConversation([data.content, socket.userId, data.convId]);
        if (client) {
             client.emit("newMsg", data);
        }
        console.log(socket.userId, data);
    });

    socket.on("disconnect", () => {
        console.log(`user ${socket.userId} disconnected`);
        clients = clients.filter((client) => client.userId !== socket.userId);
        console.log(clients);
    });
});

io.listen(3001);