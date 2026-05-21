# 🎯 Interview Analyzer

A full-stack web application that analyzes interviews — helping candidates and recruiters gain actionable insights from interview sessions.

---

## 📁 Project Structure

```
Interview-Analyzer/
├── Backend/          # Node.js/Express server
│   └── .env          # Backend environment variables
├── Frontend/         # JavaScript + SCSS client
│   └── .env          # Frontend environment variables
└── .gitignore
```

---

## 🚀 Features

- 📊 **Interview Analysis** — Process and evaluate interview data
- 🖥️ **Full-Stack Architecture** — Decoupled Frontend and Backend for scalability
- 🎨 **SCSS Styling** — Modular and maintainable stylesheet architecture
- 🔐 **Environment-Based Config** — Secure credential management via `.env` files

---

## 🛠️ Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | JavaScript, SCSS, HTML  |
| Backend   | Node.js / Express.js    |
| Styling   | SCSS (Sass)             |

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm or yarn

---

### 1. Clone the Repository

```bash
git clone https://github.com/21Shoaib/Interview-Analyzer.git
cd Interview-Analyzer
```

---

### 2. Set Up the Backend

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory:

```env
PORT=5000
# Add your API keys and config here
```

Start the backend server:

```bash
npm start
```

---

### 3. Set Up the Frontend

```bash
cd ../Frontend
npm install
```

Create a `.env` file in the `Frontend/` directory:

```env
# Add your frontend environment variables here
```

Start the frontend:

```bash
npm start
```

---

## 🌐 Usage

1. Start the backend server (runs on `http://localhost:5000` by default)
2. Start the frontend (runs on `http://localhost:3000` by default)
3. Open your browser and navigate to `http://localhost:3000`

---

## 📄 Environment Variables

Both the `Backend/` and `Frontend/` directories require a `.env` file. These files are excluded from version control for security reasons.

Refer to the respective folder's setup section above for the required variables.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📬 Contact

**Shoaib** — [@21Shoaib](https://github.com/21Shoaib)

Project Link: [https://github.com/21Shoaib/Interview-Analyzer](https://github.com/21Shoaib/Interview-Analyzer)

---

## 📝 License

This project is open source. Feel free to use and modify it.
