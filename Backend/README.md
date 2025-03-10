# Vermio Backend

## 🚀 Overview

Welcome to the backend of **Vermio**, a cloud gaming platform that provides seamless access to a variety of games. This backend is built with **Node.js, Express, and MongoDB**, offering features such as user authentication, game retrieval, friend management, and subscriptions.

## 📂 Folder Structure

```
/config        - Database configuration
/controllers   - API controllers handling authentication, games, users, and subscriptions
/models       - Mongoose models for database collections
/routes       - Express routes mapping API endpoints to controllers
/middleware   - Middleware for authentication and validation
games.js      - Main server file (entry point)
```

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** (>=14)
- **MongoDB** (local or cloud-based instance)
- **Environment variables** set up in a `.env` file:
  ```
  MONGO_URI=<your_mongo_connection_string>
  JWT_SECRET=<your_jwt_secret>
  PORT=<your_port>
  ```

### Steps to Run

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo.git
   ```
2. **Navigate to the project directory:**
   ```sh
   cd vermio-backend
   ```
3. **Install dependencies:**
   ```sh
   npm install
   ```
4. **Start the server:**
   ```sh
   npm start
   ```

## 🔌 API Endpoints

### 🔑 Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Authenticate user and return JWT
- `GET /api/auth/profile` - Retrieve authenticated user profile

### 🎮 Games

- `GET /api/games` - Fetch all games with optional filters (search, category)
- `GET /api/games/:id` - Retrieve a specific game by ID
- `POST /api/games/:id/like` - Like or unlike a game

### 💬 Game Comments

- `POST /api/games/:id/comments` - Add a comment to a game
- `POST /api/games/:id/comments/:commentId/like` - Like a comment
- `POST /api/games/:id/comments/:commentId/reply` - Reply to a comment
- `DELETE /api/games/:id/comments/:commentId` - Delete a comment
- `DELETE /api/games/:id/comments/:commentId/reply/:replyId` - Delete a reply
- `POST /api/games/:id/comments/:commentId/reply/:replyId/like` - Like a reply

### 📚 User Library

- `GET /api/users/library/me` - Get the user's game library
- `POST /api/users/library/add` - Add a game to the user's library
- `POST /api/users/library/remove` - Remove a game from the user's library

### 👥 Friend System

- `GET /api/users/query` - Search for users
- `POST /api/users/friend/request` - Send a friend request
- `POST /api/users/friend/accept` - Accept a friend request
- `POST /api/users/friend/decline` - Decline a friend request
- `GET /api/users/friends/me` - Retrieve friend list
- `POST /api/users/friend/remove` - Remove a friend

### 💳 Subscriptions

- `GET /api/subscriptions/plans` - Get available subscription plans
- `POST /api/subscriptions/subscribe` - Subscribe to a plan
- `GET /api/subscriptions/status` - Check user subscription status

## ⚙️ Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcrypt
- **Middleware:** Express Middleware for authentication and validation

## 🤝 Contributing

1. **Fork the repository**.
2. **Create a feature branch** (`git checkout -b feature-name`).
3. **Commit your changes** (`git commit -m 'Add feature'`).
4. **Push to your branch** (`git push origin feature-name`).
5. **Open a Pull Request**.

---

💡 *Feel free to contribute and improve Vermio! Happy coding! 🚀*

