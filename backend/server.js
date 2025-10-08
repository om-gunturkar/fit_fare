import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import routes from './routes.js';
import { connectDB } from './db.js'; 
import { startIdleReminder, startSessionReminders } from './notifications.js'; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});
app.get('/', (req, res) => {
  res.send('Server is running ✅');
});

startIdleReminder(io);
startSessionReminders(io);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

    socket.on('newBooking', async (data) => {
        const { trainer, time, type, date } = data; 
        
        console.log('Received booking data:', { trainer, time, date, type }); 


        const session_datetime = `${date} ${time}`; 

        const message = `Booking with ${trainer} on ${date} at ${time}`; 
        
        try {
            const dbConnection = await connectDB(); 

            await dbConnection.execute(
                'INSERT INTO bookings (trainer, time, type, date, session_datetime, notified) VALUES (?, ?, ?, ?, ?, ?)', 
                [trainer, time, type, date, session_datetime, 0] 
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
          
            const dbConnection = await connectDB(); 

            
            await dbConnection.execute('INSERT INTO reviews (user, rating, comment) VALUES (?, ?, ?)', [user, rating, comment]);
            
            socket.broadcast.emit('updateReviews');

            console.log(`New review submitted by: ${user}`);
        } catch (error) {
            console.error('Error processing new review:', error);
        }
    });
});

server.listen(process.env.PORT, () =>
  console.log(`✅ Server running on port ${process.env.PORT}`)
);

