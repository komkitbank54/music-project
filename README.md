
# 🎵 Music Recommendation System

This project is a web application that uses **ReactJS** for the frontend and **Flask** for the backend.

## ✨ Features

- **Admin Assistance:** Integrated with the **ChatGPT API** to support the admin role.
- **Recommendation System:** Uses a **K-Nearest Neighbors (KNN)** algorithm (Python) to recommend similar songs to users.

## 🚀 Tech Stack

- **Frontend:** ReactJS
- **Backend:** Flask (Python)
- **AI Integration:** OpenAI ChatGPT API
- **Recommendation Algorithm:** KNN

## 📂 Getting Started

1. **Clone this repository**

2. **Install Backend Dependencies**

   ```bash
   cd backend
   pip install -r requirements.txt
   python run.py
   ```

3. **Install Frontend Dependencies**

   ```bash
   cd frontend
   npm install
   npm start
   ```

## ⚙️ How It Works

- The **ReactJS** frontend interacts with the **Flask** backend via REST API.
- The backend uses the **ChatGPT API** to assist admins with tasks like managing content or getting song insights.
- The **KNN algorithm** analyzes user preferences and suggests similar songs.
