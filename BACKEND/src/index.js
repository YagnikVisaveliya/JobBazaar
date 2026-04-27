import dotenv from "dotenv"
import connectDB from './db/index.js';
import {app} from './app.js'
import http from 'http';
import { Server } from 'socket.io';

dotenv.config({
    path: './.env'
})

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['https://job-bazaar.vercel.app', 'http://localhost:5173', 'http://127.0.0.1:5173'],
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.set('io', io);

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    socket.on('join_interview_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('proctoring_violation_client', (data) => {
        console.log('Proctoring violation received:', data);
        io.to(data.roomId).emit('proctoring_alert', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

connectDB()
.then(() => {
    server.listen(process.env.PORT || 8000,()=>{
        console.log(`Server running port is: ${process.env.PORT}`);
        
    })
}).catch((err) => {
    console.log("MongoDB connetcion Failed",err);
    
});
