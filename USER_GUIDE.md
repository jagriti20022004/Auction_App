# 🎯 Complete User Guide - Auction App

## 📋 Table of Contents
1. [Getting Started](#getting-started)
2. [All Features Overview](#all-features-overview)
3. [Step-by-Step Feature Guide](#step-by-step-feature-guide)
4. [Feature Details](#feature-details)

---

## 🚀 Getting Started

### Step 1: Create Your Account

1. **You're currently on the Login page** - Click the **"Register"** button (blue button on the right)
2. **Fill in the registration form:**
   - **Name:** Your full name (e.g., "John Doe")
   - **Email:** Your email address (e.g., "john@example.com")
   - **Password:** At least 6 characters (e.g., "password123")
   - **Confirm Password:** Same password again
3. **Click "Create account"**
4. ✅ You'll be automatically logged in and redirected to the home page!

---

## 🎨 All Features Overview

Your Auction App has these features:

1. ✅ **User Authentication** - Register, Login, Logout
2. ✅ **Browse Auctions** - View all active auctions
3. ✅ **Advanced Search** - Search and filter auctions
4. ✅ **Create Auctions** - List your items for auction
5. ✅ **Real-time Bidding** - Place bids and see live updates
6. ✅ **My Auctions** - Manage your created auctions
7. ✅ **My Bids** - Track all your bidding activity
8. ✅ **User Profile** - View your statistics
9. ✅ **Role-Based Access** - Admin features (if you're admin)

---

## 📖 Step-by-Step Feature Guide

### Feature 1: Browse Auctions (Home Page)

**How to access:**
- After login, you'll be on the home page
- Or click **"Auctions"** in the navigation bar

**What you'll see:**
- Grid of auction cards showing:
  - Item image (if available)
  - Title and description
  - Current price
  - Number of bids
  - Time remaining
  - Category badge

**What you can do:**
- Click any auction card to view details
- Use search and filters (see Feature 2)

---

### Feature 2: Advanced Search & Filters

**How to access:**
- On the home page, you'll see a search bar and "Show Filters" button

**Step-by-step:**

1. **Text Search:**
   - Type in the search bar (e.g., "laptop", "phone")
   - Results update automatically

2. **Show Advanced Filters:**
   - Click **"Show Filters"** button
   - More options appear below

3. **Filter Options:**
   - **Category:** Select from dropdown (Electronics, Fashion, etc.)
   - **Status:** Active, Ended, or Cancelled
   - **Min Price:** Enter minimum price
   - **Max Price:** Enter maximum price
   - **Sort By:** Date, Price, End Time, or Bid Count
   - **Order:** Ascending or Descending

4. **Clear Filters:**
   - Click **"Clear Filters"** to reset everything

**Example:**
- Search: "laptop"
- Category: "Electronics"
- Min Price: 100
- Max Price: 1000
- Sort By: Price (Ascending)

---

### Feature 3: Create an Auction

**How to access:**
- Click **"Create Auction"** in the navigation bar (only visible when logged in)

**Step-by-step:**

1. **Fill in the form:**
   - **Title:** Name your item (e.g., "Vintage Camera")
   - **Description:** Describe the item in detail
   - **Starting Price:** Minimum bid amount (e.g., 50)
   - **Category:** Select from dropdown
   - **Image URL (optional):** Paste an image link (e.g., from imgur.com)
   - **End Date & Time:** Pick a future date/time

2. **Click "Create Auction"**
3. ✅ You'll be redirected to your new auction page!

**Tips:**
- Use clear, descriptive titles
- Add detailed descriptions
- Set realistic starting prices
- Choose appropriate end times (at least a few hours in the future)

---

### Feature 4: View Auction Details

**How to access:**
- Click any auction card from the home page

**What you'll see:**
- **Left side:**
  - Large item image
  - Title and category badge
  - Description
  - Bidding history (all bids with timestamps)

- **Right side:**
  - Current price (large, highlighted)
  - Starting price
  - Total bids count
  - End date/time
  - Time remaining countdown
  - Bid input form (if auction is active)
  - Seller information

**What you can do:**
- View all bid history
- Place a bid (if logged in and auction is active)
- See real-time updates when others bid

---

### Feature 5: Real-Time Bidding

**How to place a bid:**

1. **Navigate to an auction** (click on any auction card)
2. **Check if auction is active:**
   - Should show "Active" status
   - End time should be in the future
3. **Enter your bid:**
   - Look at "Current Price" (e.g., $100)
   - Enter amount higher than current (e.g., $105)
   - Minimum bid is shown below input
4. **Click "Place Bid"**
5. ✅ Your bid is placed! You'll see:
   - Toast notification
   - Price updates immediately
   - Your bid appears in bidding history
   - Real-time updates when others bid

**Real-time features:**
- Open the same auction in **two different browsers** to see live updates!
- When someone else bids, you'll see:
  - Toast notification: "New bid: $XXX"
  - Price updates automatically
  - New bid appears in history

**Rules:**
- Bid must be higher than current price
- Can't bid on your own auctions
- Can't bid on ended auctions
- Rate limited: Max 10 bids per minute

---

### Feature 6: My Auctions

**How to access:**
- Click **"My Auctions"** in the navigation bar

**What you'll see:**
- Grid of all auctions you've created
- Each card shows:
  - Auction status (Active/Ended)
  - Current price
  - Number of bids
  - End date

**What you can do:**
- **View:** Click "View" to see auction details
- **Delete:** Click "Delete" to remove an auction
  - ⚠️ This will delete all bids on that auction!

**Empty state:**
- If you haven't created any auctions, you'll see:
  - "You haven't created any auctions yet"
  - Button to "Create Your First Auction"

---

### Feature 7: My Bids

**How to access:**
- Click **"My Bids"** in the navigation bar

**What you'll see:**
- List of all auctions you've bid on
- Each item shows:
  - Auction title (clickable link)
  - Your bid amount
  - Current price
  - Auction status
  - Category
  - When you placed the bid
  - **"Winning"** badge if you're the highest bidder (active auctions)
  - **"Won"** badge if you won (ended auctions)

**What you can do:**
- Click auction title to view details
- Track which auctions you're winning
- See which auctions you've won

**Empty state:**
- If you haven't placed any bids, you'll see:
  - "You haven't placed any bids yet"
  - Button to "Browse Auctions"

---

### Feature 8: User Profile

**How to access:**
- Click your **name** in the top right navigation bar

**What you'll see:**
- **User Information:**
  - Your name
  - Your email
  - Your role (User or Admin)

- **Statistics Cards:**
  - 📦 **Auctions Created:** Total auctions you've listed
  - 🎯 **Bids Placed:** Total bids you've made
  - 🏆 **Auctions Won:** Total auctions you've won

---

### Feature 9: Navigation & Logout

**Navigation Bar (always visible at top):**
- **🎯 Auction App** (logo) - Click to go home
- **Auctions** - Browse all auctions
- **Create Auction** - Create new auction (logged in only)
- **My Auctions** - Your auctions (logged in only)
- **My Bids** - Your bids (logged in only)
- **Your Name** - Your profile (logged in only)
- **Login/Register** - Authentication (logged out only)
- **Logout** - Sign out (logged in only)

**To logout:**
1. Click **"Logout"** button (red button, top right)
2. You'll be signed out and redirected to home page

---

## 🎮 Complete Walkthrough Example

Let's do a complete example from start to finish:

### Scenario: You want to buy a laptop

1. **Register/Login:**
   - Register with your email
   - Or login if you already have an account

2. **Search for Laptops:**
   - On home page, type "laptop" in search bar
   - Click "Show Filters"
   - Select Category: "Electronics"
   - Set Min Price: 500
   - Set Max Price: 2000
   - Click away or wait for results

3. **View Auction:**
   - Click on a laptop auction that interests you
   - Read the description
   - Check current price and time remaining

4. **Place a Bid:**
   - Enter bid amount (higher than current price)
   - Click "Place Bid"
   - See your bid in the history

5. **Monitor Your Bid:**
   - Go to "My Bids" to see all your bids
   - Check if you're "Winning"
   - Return to auction page to see real-time updates

6. **If You Win:**
   - After auction ends, go to "My Bids"
   - You'll see "Won" badge on the auction
   - Check your profile to see "Auctions Won" count increase

---

## 🔐 Admin Features (If You're Admin)

If your account has admin role, you can:
- Access all auctions (even ones you didn't create)
- Edit/Delete any auction
- View all users (via API)

**To become admin:**
- You need to manually update your role in MongoDB
- Or ask a developer to do it

---

## 💡 Pro Tips

1. **Real-time Testing:**
   - Open the app in 2 different browsers
   - Login as different users
   - Place bids from both browsers
   - Watch real-time updates!

2. **Search Tips:**
   - Use specific keywords
   - Combine filters for better results
   - Sort by "End Time" to see ending soon auctions

3. **Bidding Strategy:**
   - Check "My Bids" regularly
   - Monitor auctions you're interested in
   - Bid strategically near end time

4. **Auction Management:**
   - Check "My Auctions" to see how your items are doing
   - Delete auctions that aren't getting bids
   - Update descriptions if needed

---

## 🐛 Troubleshooting

**Can't see auctions?**
- Make sure backend is running (Terminal 1)
- Check browser console (F12) for errors

**Bids not updating in real-time?**
- Make sure both backend and frontend are running
- Check your internet connection
- Refresh the page

**Can't place bid?**
- Make sure you're logged in
- Check auction is still active
- Verify bid amount is higher than current price
- Check rate limit (max 10 bids/minute)

**Search not working?**
- Try clearing filters
- Check spelling
- Make sure you're searching in active auctions

---

## ✅ Feature Checklist

Use this to test all features:

- [ ] Register a new account
- [ ] Login with existing account
- [ ] Browse auctions on home page
- [ ] Use search bar
- [ ] Apply filters (category, price, etc.)
- [ ] Create a new auction
- [ ] View auction details
- [ ] Place a bid on an auction
- [ ] See real-time bid updates
- [ ] View "My Auctions"
- [ ] View "My Bids"
- [ ] Check user profile and stats
- [ ] Logout

---

Enjoy your Auction App! 🎉





