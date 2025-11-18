# Complete Step-by-Step Setup Guide

Follow these steps **in order** to get your auction app running.

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js installed (check with: `node --version` - should be v14+)
- ✅ npm installed (check with: `npm --version`)
- ✅ MongoDB installed and running OR MongoDB Atlas account

---

## STEP 1: Install Backend Dependencies

1. Open **PowerShell** or **Command Prompt**
2. Navigate to the project folder:
   ```powershell
   cd "C:\Users\shubham kaushik\Desktop\auction_app"
   ```
3. Go to backend folder:
   ```powershell
   cd backend
   ```
4. Install all backend packages:
   ```powershell
   npm install
   ```
   ⏱️ This will take 1-2 minutes. Wait for it to finish.

---

## STEP 2: Create Backend Environment File

1. Still in the `backend` folder, create `.env` file:

   **PowerShell:**
   ```powershell
   New-Item -ItemType File -Path .env
   ```

   **OR Command Prompt:**
   ```cmd
   type nul > .env
   ```

2. Open the `.env` file (it's in the `backend` folder) with Notepad or any text editor

3. Copy and paste this EXACT content:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/auction_app
   JWT_SECRET=my_super_secret_jwt_key_12345
   JWT_EXPIRE=7d
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Save the file** (Ctrl+S)

---

## STEP 3: Start MongoDB

You have 2 options:

### Option A: Local MongoDB (if installed)
- MongoDB should already be running as a Windows service
- If not, start it from Services or run: `mongod`

### Option B: MongoDB Atlas (Cloud - Recommended for beginners)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`)
6. Replace `MONGODB_URI` in your `.env` file with this connection string
7. Add database name at the end: `mongodb+srv://.../auction_app`

---

## STEP 4: Start Backend Server

1. Make sure you're still in the `backend` folder in your terminal
2. Start the server:
   ```powershell
   npm run dev
   ```

3. **You should see:**
   ```
   MongoDB Connected
   Server running on port 5000
   ```

4. ✅ **Keep this terminal window OPEN** - the server must keep running!

5. If you see errors:
   - **MongoDB connection error**: Check Step 3 - MongoDB must be running
   - **Port 5000 already in use**: Change `PORT=5000` to `PORT=5001` in `.env` file

---

## STEP 5: Install Frontend Dependencies

1. Open a **NEW** terminal window (keep the backend terminal running!)
2. Navigate to project folder:
   ```powershell
   cd "C:\Users\shubham kaushik\Desktop\auction_app"
   ```
3. Go to frontend folder:
   ```powershell
   cd frontend
   ```
4. Install all frontend packages:
   ```powershell
   npm install
   ```
   ⏱️ This will take 2-3 minutes. Wait for it to finish.

---

## STEP 6: Start Frontend Server

1. Still in the `frontend` folder, start the development server:
   ```powershell
   npm run dev
   ```

2. **You should see:**
   ```
   VITE v4.x.x  ready in xxx ms

   ➜  Local:   http://localhost:3000/
   ➜  Network: use --host to expose
   ```

3. ✅ **Keep this terminal window OPEN too!**

---

## STEP 7: Open the Application

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Go to: **http://localhost:3000**
3. You should see the Auction App homepage! 🎉

---

## STEP 8: Test the Connection

1. **Create an Account:**
   - Click "Register" button
   - Fill in: Name, Email, Password (min 6 characters)
   - Click "Create account"
   - You should be automatically logged in

2. **Create an Auction:**
   - Click "Create Auction" in the navigation
   - Fill in the form:
     - Title: "Test Item"
     - Description: "This is a test auction"
     - Starting Price: 10
     - Category: Select any category
     - End Date & Time: Pick a future date
   - Click "Create Auction"
   - You should see your auction!

3. **Place a Bid:**
   - Go back to home page
   - Click on any auction
   - Enter a bid amount (higher than current price)
   - Click "Place Bid"
   - You should see the bid update in real-time!

---

## Troubleshooting

### Problem: "npm: command not found"
**Solution:** Node.js is not installed. Download from https://nodejs.org/

### Problem: "MongoDB connection error"
**Solutions:**
- Make sure MongoDB is running (check Windows Services)
- Or use MongoDB Atlas (cloud) - see Step 3 Option B
- Check your `.env` file has correct `MONGODB_URI`

### Problem: "Port 5000 already in use"
**Solution:** 
1. Close the backend terminal
2. Edit `backend/.env` file
3. Change `PORT=5000` to `PORT=5001`
4. Restart backend: `npm run dev`

### Problem: Frontend shows "Cannot connect" or blank page
**Solutions:**
- Make sure backend is running (check Step 4)
- Check backend terminal shows "Server running on port 5000"
- Make sure you're going to `http://localhost:3000` (not 5000)

### Problem: "Module not found" errors
**Solution:**
- Delete `node_modules` folder in that directory
- Run `npm install` again

### Problem: CORS errors in browser console
**Solution:**
- Make sure `FRONTEND_URL=http://localhost:3000` in `backend/.env`
- Restart backend server

---

## What You Should See

### Terminal 1 (Backend):
```
MongoDB Connected
Server running on port 5000
```

### Terminal 2 (Frontend):
```
VITE v4.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

### Browser:
- Beautiful auction app homepage
- Navigation bar at top
- List of auctions (or empty if no auctions yet)

---

## Quick Command Reference

**Backend Terminal:**
```powershell
cd backend
npm install          # First time only
npm run dev          # Start server
```

**Frontend Terminal:**
```powershell
cd frontend
npm install          # First time only
npm run dev          # Start server
```

---

## Next Steps After Setup

1. ✅ Create your account
2. ✅ Create your first auction
3. ✅ Test real-time bidding (open in 2 browsers to see live updates!)
4. ✅ Try the search and filter features
5. ✅ Check your profile page for stats

---

## Need Help?

If something doesn't work:
1. Check both terminals are running (backend + frontend)
2. Check MongoDB is connected (backend terminal should say "MongoDB Connected")
3. Check browser console (F12) for any errors
4. Make sure `.env` file exists in `backend` folder with correct values

Good luck! 🚀





