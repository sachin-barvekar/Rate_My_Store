# ⭐ Rate My Store
**Rate My Store** is a role-based web application that allows users to rate stores from 1 to 5 stars. It supports a login system with different access levels for Admin, Users, and Store Owners. The goal is to provide meaningful feedback through ratings, helping store owners understand customer satisfaction.

## 🚀 Getting Started
Follow the steps below to set up and run the project locally:

### 1. Clone the Repository:
git clone [https://github.com/sachin-barvekar/Rate_My_Store.git](url)

cd rate-my-store

### 2. Setup Environment Variables:
PORT=8080

DATABASE_URL=<db_url>

JWT_SECRET=<jwt_secret>

📁 In the client directory, create a .env file with:
VITE_BASE_URL=http://localhost:8080/api/v1

### 3. Install Dependencies
📦 Backend (root folder):
npm install
📦 Frontend (inside client folder):

cd client

npm install

### 4. Run the Project

▶ Start the backend server:
node server.mjs

▶ Start the frontend React app:
npm run dev

### 📌 Features

- Users can rate stores registered on the platform (1 to 5 stars).
  
- A single login system is implemented for all users.
  
- Based on the role, users will access different functionalities after logging in.
  
- Normal users can register themselves using a signup page.
  
- Admin can add stores, also add users.

## 🛠 Tech Stack

Frontend: React + React Suite

Backend: Node.js + Express

Database: MongoDB

Authentication: JWT

### Live URL: [https://ratemystore.onrender.com](url)
