# 💻 Real-Time Collaborative Code Editor

A **real-time collaborative code editor** that allows multiple users to **create or join rooms**, write code together, and see updates instantly.  
Designed for **learning, interviews, and real-world collaboration**.

---

## 🚀 Features

- 🔗 Create & Join collaboration rooms
- 👥 Real-time code editing with **Socket.IO**
- 🧠 VS Code–like editor using **Monaco Editor**
- ⚡ Execute code using **Piston API**
- 🌐 Web-based — no installation needed
- 🔄 Live synchronization across all users

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Monaco Editor
- Socket.IO Client
- UUID

### Backend
- Node.js
- Express.js
- Socket.IO
- Axios

### Others
- WebSockets
- Piston (Code Execution Engine)

---

## 📂 Project Structure

```text
collaborative-code-editor/
│
├── server/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── index.html
│   └── vite.config.js
│
├── vercel.json
├── package.json
├── LICENSE
└── README.md
```

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/aravind8204/code-editor.git
cd code-editor
```
### 2️⃣ Install backend dependencies
```bash
npm install
```

### 3️⃣ Install frontend dependencies
```bash
cd frontend
npm install
```
### 4️⃣ Run the project locally
#### Start Backend
```bash
npm start
```
#### Start frontend
```bash
cd frontend
npm run dev
```

## 🌐 Deployment (Render)
### Backend (Node + Socket.IO)
- Platform: Render Web Service
- Start Command:
```bash
npm start
```
- Root Directory: /
- WebSocket support: ✅ Yes

### Frontend (Vite + React)

- Platform: Render Static Site
- Build Command:
```bash
npm run build
```
- Publish Directory:
```text
frontend/dist
```
## 🧠 How It Works

1. The user creates or joins a room using a unique **room ID**
2. **Socket.IO** establishes a real-time WebSocket connection
3. Code updates are broadcast to all users in the same room
4. **Monaco Editor** reflects code changes instantly for every participant
5. Code execution requests are sent to the **Piston API**
6. Execution output is returned and displayed immediately in the UI

## 👤 Author

Aravindhan V

MERN Stack Developer | Python & Java Developer

## 📜 License

This project is licensed under the **MIT License**.