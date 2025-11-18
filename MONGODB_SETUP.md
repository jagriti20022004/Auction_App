# 🗄️ MongoDB Setup Guide

## Quick Check: Is MongoDB Running?

### Method 1: Check Backend Terminal

When you run `npm run dev` in the backend folder, you should see:
```
MongoDB Connected
Server running on port 5000
```

**If you DON'T see "MongoDB Connected":**
- MongoDB is not running or not connected
- Follow the setup steps below

---

## Option A: MongoDB Atlas (Cloud) - EASIEST! ⭐ Recommended

This is the easiest way - no installation needed!

### Step 1: Create Free Account

1. Go to: **https://www.mongodb.com/cloud/atlas**
2. Click **"Try Free"** or **"Sign Up"**
3. Fill in:
   - Email address
   - Password
   - Name
4. Click **"Create your Atlas account"**

### Step 2: Create Free Cluster

1. After signup, you'll see "Create a deployment"
2. Select **"M0 FREE"** (Free tier)
3. Choose a cloud provider (any is fine - AWS, Google, Azure)
4. Select a region closest to you
5. Keep cluster name as default (Cluster0)
6. Click **"Create Deployment"**
7. Wait 3-5 minutes for cluster to be created

### Step 3: Create Database User

1. You'll see "Create Database User"
2. Choose **"Password"** authentication
3. Enter:
   - **Username:** `auctionuser` (or any username)
   - **Password:** Create a strong password (save it!)
4. Click **"Create Database User"**

### Step 4: Add IP Address

1. You'll see "Where would you like to connect from?"
2. Click **"Add My Current IP Address"**
3. OR click **"Allow Access from Anywhere"** (for development only)
   - This adds `0.0.0.0/0` to allowed IPs
4. Click **"Finish and Close"**

### Step 5: Get Connection String

1. Click **"Connect"** button on your cluster
2. Choose **"Connect your application"**
3. You'll see a connection string like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. **Copy this connection string**

### Step 6: Update Your .env File

1. Open `backend/.env` file
2. Replace the `MONGODB_URI` line with:
   ```
   MONGODB_URI=mongodb+srv://auctionuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/auction_app?retryWrites=true&w=majority
   ```
   **Replace:**
   - `auctionuser` with your database username
   - `YOUR_PASSWORD` with your database password
   - `cluster0.xxxxx.mongodb.net` with your actual cluster address

3. **Save the file**

### Step 7: Restart Backend

1. Go to your backend terminal
2. Stop the server (press `Ctrl + C`)
3. Start it again:
   ```powershell
   npm run dev
   ```
4. You should now see:
   ```
   MongoDB Connected
   Server running on port 5000
   ```

✅ **Done!** MongoDB is now connected via cloud.

---

## Option B: Install MongoDB Locally

### Step 1: Download MongoDB

1. Go to: **https://www.mongodb.com/try/download/community**
2. Select:
   - **Version:** Latest (7.0 or 6.0)
   - **Platform:** Windows
   - **Package:** MSI
3. Click **"Download"**

### Step 2: Install MongoDB

1. Run the downloaded `.msi` file
2. Choose **"Complete"** installation
3. Check **"Install MongoDB as a Service"**
4. Check **"Run service as Network Service user"**
5. Check **"Install MongoDB Compass"** (optional GUI tool)
6. Click **"Install"**
7. Wait for installation to complete

### Step 3: Verify Installation

1. Open PowerShell
2. Run:
   ```powershell
   Get-Service -Name MongoDB
   ```
3. You should see MongoDB service with status "Running"

### Step 4: Test Connection

1. MongoDB should start automatically
2. If not, start it:
   ```powershell
   Start-Service MongoDB
   ```
3. Your `.env` file already has:
   ```
   MONGODB_URI=mongodb://localhost:27017/auction_app
   ```
   This should work now!

### Step 5: Restart Backend

1. Go to backend terminal
2. Stop server (`Ctrl + C`)
3. Start again:
   ```powershell
   npm run dev
   ```
4. You should see:
   ```
   MongoDB Connected
   Server running on port 5000
   ```

---

## Verify MongoDB Connection

### Method 1: Check Backend Terminal

When backend starts, you should see:
```
MongoDB Connected
Server running on port 5000
```

### Method 2: Test Connection Manually

1. Open PowerShell
2. Run:
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 27017
   ```
3. If MongoDB is running, you'll see:
   ```
   TcpTestSucceeded : True
   ```

### Method 3: Check MongoDB Service

```powershell
Get-Service -Name "*mongo*"
```

Should show MongoDB service running.

---

## Troubleshooting

### Problem: "MongoDB connection error" in backend

**Solutions:**
1. **If using Atlas:**
   - Check your connection string in `.env`
   - Make sure password is correct (no special characters need encoding)
   - Verify IP address is whitelisted in Atlas

2. **If using local:**
   - Check MongoDB service is running:
     ```powershell
     Get-Service MongoDB
     ```
   - Start it if stopped:
     ```powershell
     Start-Service MongoDB
     ```

### Problem: Can't connect to MongoDB Atlas

**Check:**
1. Internet connection
2. IP address is whitelisted in Atlas
3. Username and password are correct
4. Connection string format is correct

### Problem: MongoDB service won't start

**Solutions:**
1. Run PowerShell as Administrator
2. Try starting manually:
   ```powershell
   Start-Service MongoDB
   ```
3. Check Windows Event Viewer for errors
4. Reinstall MongoDB if needed

---

## Quick Reference

### MongoDB Atlas Connection String Format:
```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

### Local MongoDB Connection String:
```
mongodb://localhost:27017/DATABASE_NAME
```

### Your Current .env Should Have:
```
MONGODB_URI=mongodb://localhost:27017/auction_app
```
OR (if using Atlas):
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/auction_app?retryWrites=true&w=majority
```

---

## Recommendation

**For beginners:** Use **MongoDB Atlas (Option A)** - it's:
- ✅ Free
- ✅ No installation needed
- ✅ Works immediately
- ✅ Accessible from anywhere
- ✅ Managed by MongoDB

**For advanced users:** Use **Local MongoDB (Option B)** if you want:
- Offline development
- Full control
- No internet dependency

---

## Next Steps

After MongoDB is connected:
1. ✅ Backend terminal shows "MongoDB Connected"
2. ✅ Try registering again in the app
3. ✅ Should work now!

Need help? Share what you see in your backend terminal when you run `npm run dev`.





