# Vermio Frontend

## 🚀 Overview

Welcome to the frontend of **Vermio**, a cloud gaming platform designed for seamless access to various games. This frontend is built with **React, React Router, and Tailwind CSS**, offering features such as game browsing, user authentication, a game library, and social interactions.

## 📂 Folder Structure

```
/src
  /components     - Reusable UI components (Navbar, Buttons, Loaders, etc.)
  /pages         - Main pages (Home, Library, Discover, GamePage, SignIn, SignUp, etc.)
  /hooks         - Custom React hooks
  /services      - API request functions
  /context       - Context providers (AuthContext)
  App.jsx        - Main application component
  index.js       - Entry point
```

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** (>=14)
- **NPM or Yarn**
- **Backend API** running for full functionality

### Steps to Run

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo.git
   ```
2. **Navigate to the project directory:**
   ```sh
   cd vite_app
   ```
3. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```
4. **Start the development server:**
   ```sh
   npm start
   # or
   yarn start
   ```

## 🔑 Authentication & Routing

- Uses `AuthContext` for user authentication state management.
- Routes are managed with `react-router-dom`.
- Private routes restrict access to authenticated users.

### Main Routes:
- `/` - Home Page
- `/signup` - Register new account
- `/signin` - User login
- `/library` - User’s game library (Requires authentication)
- `/discover` - Discover new games
- `/categories/:catname` - Browse games by category
- `/game/:id` - Game details and interactions

## 🎮 Key Features

- **Game Browsing**: View and search for games.
- **Game Library**: Add and remove games from the user library.
- **Authentication**: Sign up, sign in, and persist login state.
- **Friend System**: Search for users and manage friends.
- **Game Comments & Likes**: Like and comment on games.

## 🔌 API Integration

The frontend communicates with the **Vermio backend** for data retrieval and user actions.

### Example API Calls:
- `GET /api/games` - Fetch all games
- `POST /api/auth/signin` - User login
- `POST /api/users/library/add` - Add a game to the library
- `POST /api/games/:id/comments` - Add a comment to a game

## 🎨 Technologies Used

- **Frontend:** React, React Router
- **UI Styling:** Tailwind CSS
- **State Management:** Context API
- **Notifications:** react-toastify

## 🚀 Deployment

To build for production:
```sh
npm run build
```

You can deploy using platforms like **Vercel, Netlify, or GitHub Pages**.

## 🤝 Contributing

1. **Fork the repository**.
2. **Create a feature branch** (`git checkout -b feature-name`).
3. **Commit your changes** (`git commit -m 'Add feature'`).
4. **Push to your branch** (`git push origin feature-name`).
5. **Open a Pull Request**.

---

💡 *Join the Vermio project and help us improve cloud gaming! 🚀*

