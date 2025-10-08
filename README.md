# Notification Panel Project

## Technologies Used

### Frontend
- **React**: UI library for building the interactive notification panel.
- **Lucide-react**: For SVG icons (e.g., Bell icon).
- **CSS**: Styling with custom CSS for components and animations.
- **Socket.IO-client**: Real-time communication with backend via WebSockets.
- **Axios** (or similar) for API calls (wrapped as `API`).

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express.js**: REST API server framework.
- **Socket.IO**: Real-time server to emit notifications and reminders.
- **Database** (e.g., MongoDB, PostgreSQL, or your choice): For persistent notification storage.

### Tools & Libraries
- **Git**: Version control.
- **NPM/Yarn**: Package manager for dependencies.
- **Lucide-react**: Icon library.
- **ESLint/Prettier** (optional): Code quality and formatting.

---

## Getting Started

### Prerequisites
- Node.js installed (v14+ recommended)
- Git installed
- Database setup and running (MongoDB/PostgreSQL/etc.)

### Backend Setup
1. Clone the repository:
2. Navigate to the backend folder:
3. Install dependencies:
4. Configure your environment variables (e.g., database URL, API keys) in `.env` file.
5. Start the backend server:
This will start the API server and Socket.IO server.

### Frontend Setup
1. Navigate to the frontend folder:
2. Install dependencies:
3. Configure API base URL in the frontend environment file if needed.
4. Start the React development server:
5. Open your browser at `http://localhost:3000` to see the notification panel.

---

## Features
- Real-time notifications via Socket.IO.
- Persistent notifications fetched from backend API.
- Toast messages for immediate user alerts.
- Idle reminders and session reminders.
- Responsive and accessible UI with smooth animations.

---

## Contributing
Feel free to open issues or submit pull requests!

---

# .env ->

DB_HOST=localhost
DB_USER='your userid'
DB_PASS='your password'
DB_NAME=notifications_db
PORT=5000
