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
