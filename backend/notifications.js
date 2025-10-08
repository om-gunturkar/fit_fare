import { connectDB } from "./db.js";

const IDLE_REMINDER_INTERVAL_MS = 5000; 
const SESSION_CHECK_INTERVAL_MS = 10000; 

const startIdleReminder = (io) => {
  const sendIdleReminder = () => {
    const reminderMessage = {
      type: "Nudge",
      message:
        "🏃 Feeling great today? Don't lose that momentum! Book your next class now before the slots fill up. Let's hit that goal! 💪", // can change it
    }; 
    io.emit("idle-reminder", reminderMessage);
    console.log(`[NUDGE] Sent real-time idle reminder.`);
  };

  setInterval(sendIdleReminder, IDLE_REMINDER_INTERVAL_MS);
  console.log(
    `[Scheduler] Idle Reminder started, running every ${
      IDLE_REMINDER_INTERVAL_MS / 60000
    } minutes.`
  );
};



const startSessionReminders = (io) => {
  setInterval(async () => {
    const now = new Date();
    try {
      const dbConnection = await connectDB();
      const [rows] = await dbConnection.execute(
        `SELECT id, trainer, type, session_datetime 
     FROM bookings 
     WHERE session_datetime > DATE_ADD(NOW(), INTERVAL 60 MINUTE) 
     AND session_datetime < DATE_ADD(NOW(), INTERVAL 24 HOUR)
     AND notified = 0`,
        []
      );
      if (rows.length === 0) {
        return;
      }

      rows.forEach(async (session) => {
        const sessionTime = new Date(session.session_datetime);
        const timeRemaining = Math.round(
          (sessionTime.getTime() - now.getTime()) / 60000
        );
        const message = `🚨 **Heads up!** Your ${session.type} session with ${session.trainer} starts in ${timeRemaining} minutes. See you soon!`;
        const type = "Session Reminder";

        
        await dbConnection.execute(
          "INSERT INTO notifications (type, message) VALUES (?, ?)",
          [type, message]
        );
        io.emit("sessionReminder", {
          type: type,
          message: message,
        });

        io.emit("newNotification", { type, message });
        console.log(
          `[REMINDER] Sent reminder for session ID ${session.id}. ${timeRemaining} minutes left.`
        ); 

        await dbConnection.execute(
          `UPDATE bookings SET notified = 1 WHERE id = ?`,
          [session.id]
        );
      });
    } catch (error) {
      console.error(
        "❌ CRITICAL ERROR in session reminder scheduler:",
        error.message
      );
    }
  }, SESSION_CHECK_INTERVAL_MS);
  console.log(
    `[Scheduler] Session Reminder started, checking every ${
      SESSION_CHECK_INTERVAL_MS / 1000
    } seconds.`
  );
};

export { startIdleReminder, startSessionReminders };
