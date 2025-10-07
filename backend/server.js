import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import routes from './routes.js';
// 💡 CRITICAL CHANGE 1: Import the named function 'connectDB' instead of the default export 'db'
import { connectDB } from './db.js'; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

const server = http.createServer(app);

// ⚡ Setup Socket.io
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

    socket.on('newBooking', async (data) => {
        const { trainer, time, type, date } = data; 
        
        console.log('Received booking data:', { trainer, time, date, type }); 

        const message = `Booking with ${trainer} on ${date} at ${time}`; 
        
        try {
            // 💡 CRITICAL CHANGE 2: Wait for the connection object
            const dbConnection = await connectDB(); 

            // Use the resolved connection object
            await dbConnection.execute(
                'INSERT INTO bookings (trainer, time, type, date) VALUES (?, ?, ?, ?)', 
                [trainer, time, type, date] 
            );
            await dbConnection.execute('INSERT INTO notifications (type, message) VALUES (?, ?)', [type, message]);
            
            io.emit('newNotification', { type, message });
            console.log(`✅ SUCCESSFULLY created new booking and notification.`);
        } catch (error) {
            console.error('❌ CRITICAL ERROR processing new booking:', error.message);
        }
    });

    socket.on('newReview', async (data) => {
        const { user, rating, comment } = data;
        try {
            // 💡 CRITICAL CHANGE 2: Wait for the connection object
            const dbConnection = await connectDB(); 

            // Use the resolved connection object
            await dbConnection.execute('INSERT INTO reviews (user, rating, comment) VALUES (?, ?, ?)', [user, rating, comment]);
            
            io.emit('updateReviews');
            console.log(`New review submitted by: ${user}`);
        } catch (error) {
            console.error('Error processing new review:', error);
        }
    });
});

server.listen(process.env.PORT, () =>
  console.log(`✅ Server running on port ${process.env.PORT}`)
);