# 🏗️ Auction App - Complete Codebase Architecture

## 📋 Table of Contents
1. [Backend Files](#backend-files)
2. [Frontend Files](#frontend-files)
3. [Data Flow](#data-flow)
4. [Key Technologies](#key-technologies)

---

## 🔧 Backend Files

### **1. `backend/server.js`** - Main Server Entry Point
**Purpose:** Central hub that initializes the Express server, MongoDB connection, Socket.io, and routes all requests.

**How it works:**
- Creates HTTP server using Express
- Initializes Socket.io with CORS configuration
- Connects to MongoDB database
- Registers all API routes (`/api/auth`, `/api/auctions`, `/api/users`)
- Sets up Socket.io authentication middleware (JWT verification)
- Handles WebSocket connections and real-time bidding events
- Listens on port 5000 (or from environment variable)

**Key Features:**
- **Socket.io Authentication:** Validates JWT token on connection, attaches `userId` and `userRole` to socket
- **Real-time Events:** Handles `join-auction`, `place-bid`, `disconnect` events
- **Room Management:** Users join auction-specific rooms for targeted broadcasts

---

### **2. `backend/models/User.js`** - User Data Model
**Purpose:** Defines the User schema and provides password hashing functionality.

**How it works:**
- **Schema Fields:**
  - `name`: User's full name (required, trimmed)
  - `email`: Unique email address (lowercase, trimmed)
  - `password`: Hashed password (min 6 chars, excluded from queries by default)
  - `role`: Enum ['user', 'admin'], defaults to 'user'
  - `createdAt`: Timestamp

- **Pre-save Hook:** Automatically hashes password using bcrypt (10 rounds) before saving
- **Instance Method:** `comparePassword()` - compares plain text password with hashed version

**Usage:** Used in authentication routes to create users, verify credentials, and check roles.

---

### **3. `backend/models/Auction.js`** - Auction Data Model
**Purpose:** Defines the Auction schema with all auction-related fields and indexes.

**How it works:**
- **Schema Fields:**
  - `title`, `description`: Item details
  - `startingPrice`, `currentPrice`: Price tracking
  - `category`: Item category
  - `image`: Optional image URL
  - `status`: Enum ['active', 'ended', 'cancelled']
  - `startTime`, `endTime`: Auction duration
  - `seller`: Reference to User (who created auction)
  - `highestBidder`: Reference to User (current highest bidder)
  - `bidCount`: Number of bids placed

- **Indexes:**
  - Text index on `title`, `description`, `category` for full-text search
  - Compound index on `status` and `endTime` for efficient filtering
  - Index on `category` for category-based queries

**Usage:** Used in auction routes for CRUD operations and search functionality.

---

### **4. `backend/models/Bid.js`** - Bid Data Model
**Purpose:** Stores individual bid records with references to auction and bidder.

**How it works:**
- **Schema Fields:**
  - `auction`: Reference to Auction document
  - `bidder`: Reference to User document
  - `amount`: Bid amount (must be positive)
  - `createdAt`: Timestamp

- **Indexes:**
  - Compound index on `auction` and `createdAt` (descending) for fast bid history retrieval
  - Index on `bidder` for user's bid queries

**Usage:** Created when users place bids via WebSocket, retrieved for bid history display.

---

### **5. `backend/middleware/auth.js`** - Authentication Middleware
**Purpose:** Protects routes by verifying JWT tokens and checking user roles.

**How it works:**
- **`protect` middleware:**
  - Extracts JWT token from `Authorization: Bearer <token>` header
  - Verifies token using JWT_SECRET
  - Fetches user from database (excluding password)
  - Attaches `req.user` to request object
  - Returns 401 if token is missing or invalid

- **`authorize` middleware:**
  - Higher-order function that accepts roles array
  - Checks if `req.user.role` is in allowed roles
  - Returns 403 if user doesn't have required role
  - Used for admin-only routes

**Usage:** Applied to protected routes using `protect` and `authorize('admin')` for role-based access.

---

### **6. `backend/middleware/rateLimiter.js`** - Rate Limiting Middleware
**Purpose:** Prevents API abuse by limiting request frequency per IP address.

**How it works:**
- **`apiLimiter`:** 100 requests per 15 minutes (general API endpoints)
- **`authLimiter`:** 5 requests per 15 minutes (login/register endpoints)
- **`bidLimiter`:** 10 requests per minute (bidding endpoints)

**Usage:** Applied to routes to prevent brute force attacks and spam.

---

### **7. `backend/routes/auth.js`** - Authentication Routes
**Purpose:** Handles user registration, login, and current user retrieval.

**How it works:**
- **POST `/api/auth/register`:**
  - Validates name, email, password using express-validator
  - Checks if user already exists
  - Creates new user (password auto-hashed by model)
  - Generates JWT token (7-day expiration)
  - Returns token and user data (without password)

- **POST `/api/auth/login`:**
  - Validates email and password
  - Finds user and explicitly selects password field
  - Compares provided password with hashed password
  - Generates JWT token on successful match
  - Returns token and user data

- **GET `/api/auth/me`:**
  - Protected route (requires authentication)
  - Returns current user's information

**Rate Limiting:** All routes use `authLimiter` (5 requests per 15 minutes).

---

### **8. `backend/routes/auctions.js`** - Auction Management Routes
**Purpose:** Handles all auction-related operations: listing, searching, creating, updating, deleting.

**How it works:**
- **GET `/api/auctions`:**
  - Advanced search with multiple filters:
    - Text search (title, description, category)
    - Category filter
    - Status filter (active/ended/cancelled)
    - Price range (min/max)
    - Sorting (price, date, endTime, bidCount)
    - Pagination (page, limit)
  - Uses MongoDB text search and query building
  - Returns paginated results with metadata

- **GET `/api/auctions/:id`:**
  - Fetches single auction with populated seller and highestBidder
  - Retrieves last 20 bids for the auction
  - Returns auction and bid history

- **POST `/api/auctions`:**
  - Protected route (requires authentication)
  - Validates all required fields
  - Ensures endTime is in the future
  - Creates auction with seller = current user
  - Sets currentPrice = startingPrice initially

- **PUT `/api/auctions/:id`:**
  - Protected route
  - Checks if user is seller OR admin
  - Updates auction fields (title, description, category, image)
  - Returns updated auction

- **DELETE `/api/auctions/:id`:**
  - Protected route
  - Checks if user is seller OR admin
  - Deletes all bids associated with auction
  - Deletes auction document

- **GET `/api/auctions/categories/list`:**
  - Returns distinct list of all categories
  - Used for category dropdown in frontend

**Rate Limiting:** Uses `apiLimiter` for general routes, `bidLimiter` for bidding operations.

---

### **9. `backend/routes/users.js`** - User Profile Routes
**Purpose:** Handles user-specific data retrieval: profile, auctions, bids.

**How it works:**
- **GET `/api/users/profile`:**
  - Protected route
  - Returns user info with statistics:
    - Number of auctions created
    - Number of bids placed
    - Number of auctions won

- **GET `/api/users/my-auctions`:**
  - Protected route
  - Returns all auctions created by current user
  - Sorted by creation date (newest first)

- **GET `/api/users/my-bids`:**
  - Protected route
  - Returns all bids placed by current user
  - Populates auction details
  - Sorted by creation date (newest first)

- **GET `/api/users`:**
  - Protected route, Admin only
  - Returns all users (without passwords)
  - Admin dashboard functionality

---

## 🎨 Frontend Files

### **1. `frontend/src/main.jsx`** - React Application Entry Point
**Purpose:** Initializes React application and renders root component.

**How it works:**
- Uses React 18's `createRoot` API
- Renders `<App />` component
- Imports global CSS styles
- Wraps in `StrictMode` for development warnings

---

### **2. `frontend/src/App.jsx`** - Main Application Component
**Purpose:** Sets up routing, authentication context, and global UI components.

**How it works:**
- **Routing:** Uses React Router v6
  - Public routes: `/`, `/login`, `/register`, `/auction/:id`
  - Private routes: `/create-auction`, `/my-auctions`, `/my-bids`, `/profile`
- **AuthProvider:** Wraps entire app to provide authentication context
- **Navbar:** Always visible navigation component
- **ToastContainer:** Global notification system (react-toastify)
- **404 Handling:** Redirects unknown routes to home page

**Route Protection:** Private routes wrapped in `<PrivateRoute>` component.

---

### **3. `frontend/src/context/AuthContext.jsx`** - Authentication Context
**Purpose:** Manages global authentication state and provides auth methods to all components.

**How it works:**
- **State Management:**
  - `user`: Current logged-in user object
  - `loading`: Loading state during auth checks
  - `token`: JWT token from localStorage

- **useEffect Hook:**
  - On mount, checks for token in localStorage
  - If token exists, sets axios default Authorization header
  - Fetches user data from `/api/auth/me`
  - Handles token expiration (removes invalid token)

- **Methods:**
  - `login(email, password)`: 
    - POST to `/api/auth/login`
    - Stores token in localStorage
    - Updates axios headers
    - Sets user state
  - `register(name, email, password)`:
    - POST to `/api/auth/register`
    - Same token handling as login
  - `logout()`:
    - Removes token from localStorage
    - Clears user state
    - Removes axios headers

**Usage:** Accessed via `useContext(AuthContext)` in any component.

---

### **4. `frontend/src/components/Navbar.jsx`** - Navigation Bar
**Purpose:** Provides site-wide navigation and user authentication UI.

**How it works:**
- Displays app logo/brand
- Shows different links based on authentication state:
  - **Unauthenticated:** Auctions, Login, Register
  - **Authenticated:** Auctions, Create Auction, My Auctions, My Bids, Profile
- Shows user name and role badge (if admin)
- Logout button calls `logout()` from AuthContext
- Uses React Router `Link` for navigation

---

### **5. `frontend/src/components/PrivateRoute.jsx`** - Route Protection Component
**Purpose:** Protects routes that require authentication.

**How it works:**
- Checks `user` and `loading` from AuthContext
- Shows loading spinner while checking authentication
- If user exists, renders children (protected component)
- If no user, redirects to `/login` using `Navigate` component
- Prevents unauthorized access to protected pages

---

### **6. `frontend/src/components/SearchFilters.jsx`** - Search & Filter Component
**Purpose:** Provides advanced filtering UI for auction listings.

**How it works:**
- **Filters Available:**
  - Text search (real-time)
  - Category dropdown (fetched from API)
  - Status dropdown (active/ended/cancelled)
  - Min/Max price inputs
  - Sort by (date, price, endTime, bidCount)
  - Sort order (ascending/descending)

- **Features:**
  - Collapsible filter panel
  - Fetches categories from `/api/auctions/categories/list`
  - Updates parent component's filter state
  - "Clear Filters" button resets all filters

**Usage:** Used in `Home.jsx` to filter auction listings.

---

### **7. `frontend/src/pages/Home.jsx`** - Auction Listing Page
**Purpose:** Displays paginated list of auctions with search/filter capabilities.

**How it works:**
- **State Management:**
  - `auctions`: Array of auction objects
  - `loading`: Loading state
  - `filters`: Search and filter parameters
  - `pagination`: Page number, total count, total pages

- **useEffect Hook:**
  - Fetches auctions when filters or page changes
  - Builds query parameters from filter state
  - Calls `/api/auctions` with query params

- **Features:**
  - Displays auctions in responsive grid (1/2/3 columns)
  - Shows auction image, title, description, price, bid count
  - Time remaining calculation
  - Pagination controls (Previous/Next)
  - Loading spinner during fetch
  - Empty state message

- **Helper Functions:**
  - `formatDate()`: Formats timestamps
  - `formatPrice()`: Currency formatting
  - `getTimeRemaining()`: Calculates time until auction ends

---

### **8. `frontend/src/pages/AuctionDetail.jsx`** - Auction Detail & Bidding Page
**Purpose:** Displays full auction details and handles real-time bidding via WebSocket.

**How it works:**
- **Initial Load:**
  - Fetches auction and bid history from `/api/auctions/:id`
  - Sets up WebSocket connection (if user is authenticated)
  - Joins auction room via `join-auction` event

- **WebSocket Connection:**
  - Creates Socket.io client connection to `http://localhost:5000`
  - Sends JWT token in `auth.token` for authentication
  - On connect, emits `join-auction` with auction ID
  - Listens for `new-bid` events (updates UI in real-time)
  - Listens for `bid-error` events (shows error toast)

- **Real-time Updates:**
  - When `new-bid` received:
    - Adds new bid to bid history (prepended to array)
    - Updates auction currentPrice
    - Updates bidCount
    - Shows toast notification
  - All connected clients see updates instantly

- **Bidding:**
  - Form validates bid amount > currentPrice
  - Emits `place-bid` event with auctionId and bidAmount
  - Server validates and processes bid
  - Server broadcasts `new-bid` to all clients in auction room
  - Auto-increments bid input field

- **UI Features:**
  - Auction image, title, description
  - Current price display
  - Bidding form (only for active auctions, not for seller)
  - Bid history list (scrollable)
  - Time remaining countdown
  - Seller information

- **Cleanup:**
  - Closes WebSocket connection on component unmount

---

### **9. `frontend/src/pages/Login.jsx`** - Login Page
**Purpose:** User authentication form.

**How it works:**
- Form with email and password fields
- On submit, calls `login()` from AuthContext
- Shows loading state during request
- Displays success/error toasts
- Redirects to home on successful login
- Link to registration page

---

### **10. `frontend/src/pages/Register.jsx`** - Registration Page
**Purpose:** New user registration form.

**How it works:**
- Form with name, email, password fields
- Validates input (email format, password length)
- On submit, calls `register()` from AuthContext
- Shows loading state during request
- Displays success/error toasts
- Redirects to home on successful registration
- Link to login page

---

### **11. `frontend/src/pages/CreateAuction.jsx`** - Create Auction Page
**Purpose:** Form to create new auction listings.

**How it works:**
- **Form Fields:**
  - Title (required)
  - Description (required, textarea)
  - Starting Price (required, number)
  - Category (required, dropdown)
  - Image URL (optional)
  - End Date & Time (required, datetime-local)

- **Validation:**
  - Client-side HTML5 validation
  - Server-side validation via express-validator
  - Ensures endTime is in the future

- **Submission:**
  - POST to `/api/auctions`
  - On success, redirects to new auction detail page
  - Shows error toast on failure

---

### **12. `frontend/src/pages/MyAuctions.jsx`** - User's Auctions Page
**Purpose:** Displays all auctions created by the current user.

**How it works:**
- Fetches auctions from `/api/users/my-auctions`
- Displays auctions in grid layout
- Shows auction status, current price, bid count
- Links to auction detail pages
- Empty state if no auctions created

---

### **13. `frontend/src/pages/MyBids.jsx`** - User's Bids Page
**Purpose:** Displays all bids placed by the current user.

**How it works:**
- Fetches bids from `/api/users/my-bids`
- Displays each bid with:
  - Auction title and image
  - Bid amount
  - Bid timestamp
  - Link to auction detail page
- Sorted by most recent first
- Empty state if no bids placed

---

### **14. `frontend/src/pages/Profile.jsx`** - User Profile Page
**Purpose:** Displays user information and statistics.

**How it works:**
- Fetches profile data from `/api/users/profile`
- Displays:
  - User name and email
  - Statistics:
    - Auctions created count
    - Bids placed count
    - Auctions won count
- Shows role badge if admin

---

### **15. `frontend/vite.config.js`** - Vite Configuration
**Purpose:** Configures the Vite build tool and development server.

**How it works:**
- **Plugins:** React plugin for JSX support
- **Server:**
  - Runs on port 3000
  - **Proxy Configuration:** 
    - Proxies `/api/*` requests to `http://localhost:5000`
    - Enables CORS-free API calls from frontend
    - `changeOrigin: true` for proper header handling

**Why Proxy?** Allows frontend to make API calls without CORS issues during development.

---

## 🔄 Data Flow

### **Authentication Flow:**
1. User submits login/register form
2. Frontend calls `AuthContext.login()` or `register()`
3. Request sent to `/api/auth/login` or `/api/auth/register`
4. Backend validates, creates/verifies user, generates JWT
5. Token returned to frontend
6. Token stored in localStorage
7. Token added to axios default headers
8. User data stored in AuthContext state
9. Protected routes now accessible

### **Auction Listing Flow:**
1. User visits home page
2. `Home.jsx` fetches auctions from `/api/auctions` with filters
3. Backend queries MongoDB with filters, pagination, sorting
4. Results returned to frontend
5. Auctions displayed in grid
6. User can filter/search, triggering new API call

### **Real-time Bidding Flow:**
1. User opens auction detail page
2. `AuctionDetail.jsx` fetches auction data via REST API
3. WebSocket connection established (if authenticated)
4. Client emits `join-auction` with auction ID
5. Server adds socket to auction room
6. User places bid → emits `place-bid` event
7. Server validates bid (amount, auction status, time)
8. Server saves bid to database
9. Server updates auction currentPrice
10. Server broadcasts `new-bid` to all sockets in auction room
11. All connected clients receive update instantly
12. UI updates automatically (price, bid history, toast)

### **Auction Creation Flow:**
1. User fills out create auction form
2. Form submitted to `/api/auctions` (POST)
3. Backend validates data
4. Auction created in database
5. Response includes new auction ID
6. Frontend redirects to auction detail page

---

## 🛠️ Key Technologies

### **Backend:**
- **Express.js:** Web framework for REST API
- **MongoDB + Mongoose:** Database and ODM
- **Socket.io:** WebSocket library for real-time communication
- **JWT (jsonwebtoken):** Stateless authentication
- **bcryptjs:** Password hashing
- **express-validator:** Input validation
- **express-rate-limit:** API rate limiting
- **CORS:** Cross-origin resource sharing

### **Frontend:**
- **React 18:** UI library
- **React Router v6:** Client-side routing
- **Axios:** HTTP client for API calls
- **Socket.io-client:** WebSocket client
- **React Context API:** Global state management
- **React Toastify:** Toast notifications
- **Tailwind CSS:** Utility-first CSS framework
- **Vite:** Build tool and dev server

---

## 🔐 Security Features

1. **JWT Authentication:** Stateless, secure token-based auth
2. **Password Hashing:** bcrypt with 10 rounds
3. **Rate Limiting:** Prevents brute force and spam
4. **Input Validation:** Server-side validation on all inputs
5. **Role-Based Access:** Admin vs User permissions
6. **CORS Protection:** Configured for specific origins
7. **Protected Routes:** Frontend and backend route protection
8. **Socket Authentication:** JWT verification on WebSocket connection

---

## 📊 Database Schema Relationships

```
User (1) ──< (Many) Auction (seller)
User (1) ──< (Many) Bid (bidder)
Auction (1) ──< (Many) Bid (auction)
Auction (1) ──> (1) User (highestBidder)
```

---

## 🚀 Performance Optimizations

1. **MongoDB Indexes:** Text search, compound indexes for filtering
2. **Pagination:** Limits data transfer, improves load times
3. **WebSocket Rooms:** Targeted broadcasts (only relevant clients)
4. **React Context:** Efficient state sharing without prop drilling
5. **Lazy Loading:** Components loaded on demand
6. **Query Optimization:** Selective field population, limited bid history

---

This architecture provides a scalable, secure, and real-time auction platform with clear separation of concerns between frontend and backend.

