# 🚀 START HERE - Quick Setup Guide

## ⚡ Quick Start (3 Steps)

### Step 1: Install Backend
Open PowerShell and run:
```powershell
cd "C:\Users\shubham kaushik\Desktop\auction_app\backend"
npm install
```

### Step 2: Install Frontend  
Open a NEW PowerShell window and run:
```powershell
cd "C:\Users\shubham kaushik\Desktop\auction_app\frontend"
npm install
```

### Step 3: Start Everything

**Terminal 1 - Backend:**
```powershell
cd "C:\Users\shubham kaushik\Desktop\auction_app\backend"
npm run dev
```
✅ Wait until you see: `Server running on port 5000`

**Terminal 2 - Frontend:**
```powershell
cd "C:\Users\shubham kaushik\Desktop\auction_app\frontend"
npm run dev
```
✅ Wait until you see: `Local: http://localhost:3000/`

### Step 4: Open Browser
Go to: **http://localhost:3000**

---

## 📋 Detailed Instructions

### Prerequisites
- ✅ Node.js installed (check: `node --version`)
- ✅ MongoDB running (local or Atlas)

### Backend Setup

1. **Open PowerShell**
2. **Navigate to backend:**
   ```powershell
   cd "C:\Users\shubham kaushik\Desktop\auction_app\backend"
   ```

3. **Install packages:**
   ```powershell
   npm install
   ```
   ⏱️ Wait 1-2 minutes

4. **Check .env file exists** (already created for you!)
   - Location: `backend\.env`
   - Should contain:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/auction_app
     JWT_SECRET=my_super_secret_jwt_key_12345
     JWT_EXPIRE=7d
     NODE_ENV=development
     FRONTEND_URL=http://localhost:3000
     ```

5. **Start backend:**
   ```powershell
   npm run dev
   ```

6. **✅ Success looks like:**
   ```
   MongoDB Connected
   Server running on port 5000
   ```
   **Keep this terminal open!**

### Frontend Setup

1. **Open a NEW PowerShell window** (keep backend running!)

2. **Navigate to frontend:**
   ```powershell
   cd "C:\Users\shubham kaushik\Desktop\auction_app\frontend"
   ```

3. **Install packages:**
   ```powershell
   npm install
   ```
   ⏱️ Wait 2-3 minutes

4. **Start frontend:**
   ```powershell
   npm run dev
   ```

5. **✅ Success looks like:**
   ```
   VITE v4.x.x  ready in xxx ms
   ➜  Local:   http://localhost:3000/
   ```
   **Keep this terminal open too!**

### Open the App

1. Open your browser (Chrome, Edge, Firefox)
2. Go to: **http://localhost:3000**
3. You should see the Auction App! 🎉

---

## 🧪 Test the App

1. **Register:**
   - Click "Register"
   - Fill: Name, Email, Password (min 6 chars)
   - Click "Create account"

2. **Create Auction:**
   - Click "Create Auction"
   - Fill the form
   - Click "Create Auction"

3. **Place Bid:**
   - Click on an auction
   - Enter bid amount
   - Click "Place Bid"
   - See real-time updates! ⚡

---

## ❌ Troubleshooting

### "npm: command not found"
→ Install Node.js from https://nodejs.org/

### "MongoDB connection error"
→ Start MongoDB or use MongoDB Atlas (cloud)

### "Port 5000 already in use"
→ Change `PORT=5000` to `PORT=5001` in `backend\.env`

### Blank page in browser
→ Make sure backend is running (check Terminal 1)

### CORS errors
→ Make sure `FRONTEND_URL=http://localhost:3000` in `backend\.env`

---

## 📁 What Should Be Running

✅ **Terminal 1:** Backend server (port 5000)
✅ **Terminal 2:** Frontend server (port 3000)  
✅ **Browser:** http://localhost:3000

---

## 🎯 You're All Set!

For more details, see `SETUP_GUIDE.md`





