# LeetCode Spaced Repetition Tracker

A Full-Stack **MERN** application designed to help software engineers master LeetCode questions using **Spaced Repetition**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Stack](https://img.shields.io/badge/stack-MERN-green.svg)

## Features

- **Spaced Repetition Algorithm**: Custom interval schedule tailored for interview prep (`1d -> 3d -> 7d -> 14d -> 30d`).
- **Review System**:
    - **Good**: Advances 1 level.
    - **Easy**: **Speed Bonus** (Skips a level).
    - **Hard**: Resets progress to Day 1.
- **Dark Mode UI**: Clean, distraction-free aesthetic inspired by NeetCode.io.
- **Full Stack Architecture**:
    - **Frontend**: React + Vite
    - **Backend**: Node.js + Express
    - **Database**: MongoDB Atlas (Cloud)

## Tech Stack

- **Frontend**: React.js, Generic CSS (NeetCode Theme)
- **Backend**: Express.js, Mongoose
- **Database**: MongoDB
- **Tooling**: Vite, Nodemon

## Installation & Run

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/leetcode-sr.git
    cd leetcode-sr
    ```

2.  **Install Dependencies**:
    ```bash
    # Install Root/Frontend deps
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env` file in the root directory:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string_here
    ```

4.  **Start the Application**:
    You need two terminals:

    **Terminal 1 (Backend)**:
    ```bash
    node server/server.js
    ```

    **Terminal 2 (Frontend)**:
    ```bash
    npm run dev
    ```

## Spaced Repetition Logic

This app uses a simplified interval schedule designed for rapid interview preparation:
- **Level 1**: 1 Day
- **Level 2**: 3 Days
- **Level 3**: 7 Days
- **Level 4**: 14 Days
- **Level 5**: 30 Days
- **Level 6**: 60 Days

*Marking a question as "Hard" resets it to Level 1. Marking "Easy" skips a level*
