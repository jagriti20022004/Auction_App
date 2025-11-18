# 🔧 Troubleshooting Guide - Registration Failed

## Quick Checklist

Before troubleshooting, verify:

- [ ] **Backend is running** - Check Terminal 1 shows "Server running on port 5000"
- [ ] **MongoDB is connected** - Check Terminal 1 shows "MongoDB Connected"
- [ ] **Frontend is running** - Check Terminal 2 shows "Local: http://localhost:3000/"
- [ ] **Both terminals are open** - Backend AND Frontend must be running

---

## Common Issues & Solutions

### Issue 1: "Cannot connect to server" Error

**Symptoms:**
- Toast shows: "Cannot connect to server. Make sure backend is running on port 5000."
- Or generic "Registration failed"

**Solution:**
1. **Check if backend is running:**
   - Open Terminal 1 (backend)
   - You should see: `Server running on port 5000`
   - If not, run: `npm run dev` in the `backend` folder

2. **Check backend terminal for errors:**
   - Look for red error messages
   - Common errors:
     - "MongoDB connection error" → See Issue 2
     - "Port 5000 already in use" → See Issue 3

3. **Verify .env file exists:**
   - Go to `backend` folder
   - Make sure `.env` file exists
   - Should contain:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/auction_app
     JWT_SECRET=my_super_secret_jwt_key_12345
     JWT_EXPIRE=7d
     NODE_ENV=development
     FRONTEND_URL=http://localhost:3000
     ```

---

### Issue 2: "MongoDB connection error"

**Symptoms:**
- Backend terminal shows: "MongoDB connection error"
- Registration fails

**Solutions:**

**Option A: Start Local MongoDB**
1. Open Windows Services (Win + R, type `services.msc`)
2. Find "MongoDB" service
3. Right-click → Start
4. Restart backend server

**Option B: Use MongoDB Atlas (Cloud) - Recommended**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `backend/.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/auction_app
   ```
7. Restart backend server

**Option C: Install MongoDB Locally**
- Download from https://www.mongodb.com/try/download/community
- Install and start the service

---

### Issue 3: "Port 5000 already in use"

**Symptoms:**
- Backend won't start
- Error: "Port 5000 already in use"

**Solution:**
1. **Find what's using port 5000:**
   ```powershell
   netstat -ano | findstr :5000
   ```
2. **Kill the process** (replace PID with the number from above):
   ```powershell
   taskkill /PID <PID> /F
   ```
3. **OR change the port:**
   - Edit `backend/.env` file
   - Change `PORT=5000` to `PORT=5001`
   - Update `frontend/vite.config.js`:
     ```javascript
     proxy: {
       '/api': {
         target: 'http://localhost:5001',  // Changed from 5000
         changeOrigin: true
       }
     }
     ```
   - Restart both backend and frontend

---

### Issue 4: "User already exists"

**Symptoms:**
- Toast shows: "User already exists"

**Solution:**
- This means the email is already registered
- Try a different email address
- Or use the "Login" page instead

---

### Issue 5: Validation Errors

**Symptoms:**
- Toast shows specific validation message
- Examples: "Name is required", "Please provide a valid email", "Password must be at least 6 characters"

**Solution:**
- Fill in all required fields correctly:
  - Name: Any text
  - Email: Valid email format (e.g., test@example.com)
  - Password: At least 6 characters
  - Confirm Password: Must match password

---

### Issue 6: CORS Errors

**Symptoms:**
- Browser console (F12) shows CORS errors
- Registration fails

**Solution:**
1. Check `backend/.env` has:
   ```
   FRONTEND_URL=http://localhost:3000
   ```
2. Restart backend server
3. Clear browser cache (Ctrl + Shift + Delete)

---

### Issue 7: Network Error / ECONNREFUSED

**Symptoms:**
- Toast shows: "Cannot connect to server"
- Browser console shows network errors

**Solution:**
1. **Check backend is running:**
   - Terminal 1 should show: `Server running on port 5000`
   - If not, start it: `cd backend && npm run dev`

2. **Check firewall:**
   - Windows Firewall might be blocking
   - Temporarily disable to test

3. **Check proxy settings:**
   - Make sure `frontend/vite.config.js` has correct proxy:
     ```javascript
     proxy: {
       '/api': {
         target: 'http://localhost:5000',
         changeOrigin: true
       }
     }
     ```

---

## Step-by-Step Debugging

### Step 1: Check Backend Status

**In Terminal 1 (Backend):**
```powershell
cd backend
npm run dev
```

**Expected output:**
```
MongoDB Connected
Server running on port 5000
```

**If you see errors:**
- MongoDB error → Fix MongoDB connection (Issue 2)
- Port error → Fix port issue (Issue 3)
- Module not found → Run `npm install` again

---

### Step 2: Check Frontend Status

**In Terminal 2 (Frontend):**
```powershell
cd frontend
npm run dev
```

**Expected output:**
```
VITE v4.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

---

### Step 3: Check Browser Console

1. Open browser (http://localhost:3000)
2. Press **F12** to open Developer Tools
3. Click **Console** tab
4. Try to register again
5. Look for error messages

**Common errors:**
- `Network Error` → Backend not running
- `CORS error` → Check FRONTEND_URL in .env
- `404 Not Found` → Check API route exists
- `500 Internal Server Error` → Check backend terminal for details

---

### Step 4: Test Backend Directly

**Test if backend API works:**
1. Open browser
2. Go to: `http://localhost:5000/api/auctions`
3. You should see JSON response (even if empty array)
4. If you get error → Backend is not working

---

### Step 5: Check Network Tab

1. Open browser Developer Tools (F12)
2. Click **Network** tab
3. Try to register
4. Look for the request to `/api/auth/register`
5. Click on it to see:
   - **Status:** Should be 200 or 201 (success)
   - **Response:** Should show user data
   - **Request:** Should show the data you sent

**If status is:**
- **404** → Backend route not found
- **500** → Backend server error (check backend terminal)
- **400** → Validation error (check response message)
- **Network Error** → Backend not running

---

## Quick Fix Commands

**Restart everything:**
```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (in new terminal)
cd frontend
npm run dev
```

**Reinstall dependencies:**
```powershell
# Backend
cd backend
rm -r node_modules
npm install

# Frontend
cd frontend
rm -r node_modules
npm install
```

**Check if ports are in use:**
```powershell
# Check port 5000
netstat -ano | findstr :5000

# Check port 3000
netstat -ano | findstr :3000
```

---

## Still Not Working?

1. **Check both terminals are running**
2. **Check MongoDB is connected** (Terminal 1 should say "MongoDB Connected")
3. **Check browser console** (F12) for specific errors
4. **Check backend terminal** for error messages
5. **Verify .env file** exists and has correct values
6. **Try restarting everything:**
   - Close both terminals
   - Close browser
   - Start backend → Start frontend → Open browser

---

## Need More Help?

Share these details:
1. What error message you see (exact text)
2. Backend terminal output (screenshot or copy text)
3. Browser console errors (F12 → Console tab)
4. Network tab details (F12 → Network tab → click on failed request)





