# ✉️ AI Email Hub - Smart Email & Campaign Manager

An end-to-end full-stack web application built with **React**, **Python Flask**, **SQLAlchemy ORM (MySQL / SQLite)**, and **Google Gemini AI**.

---

## ✨ Features

- 🔐 **User Authentication**: Secure Signup/Login with password hashing & JWT token session authorization.
- 📊 **Interactive Dashboard**: Operational metrics, total emails, active drafts, category breakdown progress bars, and recent activity feed.
- 📬 **Full Email CRUD**: Create, read, update, filter, and delete emails (Drafts, Sent, Scheduled).
- 🤖 **AI Copywriter & Summarizer**: Powered by Google Gemini AI to draft emails tailored to specific tones (*Professional, Persuasive, Urgent, Friendly, Formal*) and automatically summarize email threads.
- 📄 **Email Templates**: Create and insert reusable email templates.
- 🎨 **Modern Design System**: Dark glassmorphism interface with glowing accents and responsive layouts.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, React Router, Lucide Icons, Axios, Modern Vanilla CSS
- **Backend**: Python, Flask, Flask-Cors, Flask-SQLAlchemy, PyJWT, Werkzeug
- **Database**: MySQL (PyMySQL) with automatic SQLite fallback
- **AI Integration**: Google Gemini API (`google-genai` SDK)

---

## 🚀 Quick Setup Instructions

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python run.py
```
> Running on `http://127.0.0.1:5000`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
> Running on `http://localhost:3000`

---

## 🚀 Deploy to Render

The repo includes a `Dockerfile` and `render.yaml` blueprint for a one-service deploy
(FastAPI serves both the API and the built React frontend on the same origin).

1. Push this repo to GitHub.
2. Sign in at https://render.com and click **New + → Blueprint**.
3. Connect your GitHub repo — Render reads `render.yaml` and creates the web service.
4. After first deploy, open **Environment** and replace the `REPLACE_ME` values:
   - `GEMINI_API_KEY`, `GROQ_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - `APP_SECRET_KEY` (use a long random string)
   - `FRONTEND_URL` / `BACKEND_URL` → your service URL (e.g. `https://mailpilot.onrender.com`)
   - `GOOGLE_REDIRECT_URI` → `https://mailpilot.onrender.com/api/auth/google/callback`
   - `DATABASE_URL` → optional: a Render PostgreSQL connection string (SQLite file storage is used by default and does not persist across redeploys)
5. Click **Manual Deploy → Deploy latest commit**.

The app is then available at your Render URL.
