# Cafe Fausse - Local Setup Guide for macOS

This guide walks you through setting up and running the Cafe Fausse restaurant website on your Mac for demonstration purposes.

---

## Prerequisites

You need three things installed on your Mac:

1. **Node.js** (v18 or later) and **pnpm**
2. **Python 3** (v3.9 or later)
3. **MySQL** (v8.0 or later)

### Install Node.js and pnpm

If you do not already have Node.js installed:

```bash
# Using Homebrew (recommended)
brew install node

# Install pnpm globally
npm install -g pnpm
```

Verify installation:
```bash
node --version   # Should show v18+ or v22+
pnpm --version   # Should show v8+ or v10+
```

### Install Python 3

macOS typically comes with Python 3. Verify:

```bash
python3 --version   # Should show 3.9+
```

If not installed:
```bash
brew install python3
```

### Install MySQL

```bash
# Using Homebrew
brew install mysql

# Start MySQL service
brew services start mysql

# Secure the installation (set a root password)
mysql_secure_installation
```

---

## Step 1: Download and Extract the Project

After downloading the `cafe-fausse.zip` file, extract it:

```bash
unzip cafe-fausse.zip
cd cafe-fausse
```

---

## Step 2: Set Up the Database

Open a MySQL shell and create the database and tables:

```bash
mysql -u root -p
```

Then run the following SQL (or use the included `flask_backend/schema.sql` file):

```sql
CREATE DATABASE IF NOT EXISTS cafe_fausse;
USE cafe_fausse;

CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(320) NOT NULL,
    phone VARCHAR(20),
    newsletterSignup BOOLEAN NOT NULL DEFAULT FALSE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_email (email)
);

CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerId INT NOT NULL,
    reservationDate VARCHAR(10) NOT NULL,
    timeSlot VARCHAR(5) NOT NULL,
    tableNumber INT NOT NULL,
    guestCount INT NOT NULL,
    status ENUM('confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'confirmed',
    specialRequests TEXT,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customerId) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS newsletterSubscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(320) NOT NULL UNIQUE,
    name VARCHAR(255),
    subscribedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    isActive BOOLEAN NOT NULL DEFAULT TRUE
);
```

Or run the SQL file directly:

```bash
mysql -u root -p < flask_backend/schema.sql
```

---

## Step 3: Install Python Dependencies

```bash
pip3 install -r flask_backend/requirements.txt
```

This installs Flask, Flask-CORS, PyMySQL, and cryptography.

---

## Step 4: Install Node.js Dependencies

```bash
pnpm install
```

This installs all React frontend dependencies and the development server.

---

## Step 5: Start the Flask Backend (Terminal 1)

Open a terminal window and run:

```bash
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/cafe_fausse" python3 flask_backend/app.py
```

Replace `YOUR_PASSWORD` with your MySQL root password. If you did not set a password, use:

```bash
DATABASE_URL="mysql://root:@localhost:3306/cafe_fausse" python3 flask_backend/app.py
```

You should see:
```
 * Serving Flask app 'app'
 * Running on http://127.0.0.1:5000
```

Leave this terminal running.

---

## Step 6: Start the React Frontend (Terminal 2)

Open a **second** terminal window and run:

```bash
pnpm dev
```

You should see:
```
Server running on http://localhost:3000/
```

Leave this terminal running.

---

## Step 7: Open the Website

Open your browser and navigate to:

```
http://localhost:3000
```

You should see the Cafe Fausse homepage with the elegant fine-dining design.

---

## Testing the Application

### Test the Reservation System

1. Click **"Reserve a Table"** in the navigation bar
2. Select a date from the calendar
3. Choose a time slot (availability shown for each slot)
4. Enter guest count, name, email, and phone
5. Optionally check "Subscribe to newsletter"
6. Click **"Confirm Reservation"**
7. You should see a confirmation with your assigned table number

### Test the Newsletter Signup

1. Scroll to the bottom of the **Home** page
2. Find the newsletter signup section
3. Enter your email address
4. Click **"Subscribe"**
5. You should see a success message

### Verify Data in the Database

Open a MySQL shell to check the data:

```bash
mysql -u root -p cafe_fausse
```

```sql
-- Check customers
SELECT * FROM customers;

-- Check reservations
SELECT r.*, c.name, c.email 
FROM reservations r 
JOIN customers c ON r.customerId = c.id;

-- Check newsletter subscribers
SELECT * FROM newsletterSubscribers;
```

### Test the Flask API Directly

You can also test the API endpoints with curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Check available slots
curl "http://localhost:5000/api/reservations/available-slots?date=2026-02-10"

# Create a reservation
curl -X POST http://localhost:5000/api/reservations/create \
  -H "Content-Type: application/json" \
  -d '{"name":"John Smith","email":"john@example.com","phone":"555-1234","date":"2026-02-10","timeSlot":"19:00","guestCount":4,"specialRequests":"Window seat","newsletterSignup":true}'

# Subscribe to newsletter
curl -X POST http://localhost:5000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

---

## Demo Walkthrough (for your 5-10 min video)

Here is a suggested flow for your demonstration video:

1. **Show the project structure** in your code editor (VS Code), highlighting:
   - `flask_backend/app.py` (Flask backend)
   - `client/src/pages/` (React pages)
   - `drizzle/schema.ts` (database schema)

2. **Start both servers** (Flask + React dev server) in your terminal

3. **Walk through each page**:
   - **Home**: Hero section, restaurant highlights, awards, newsletter signup
   - **Menu**: Switch between Appetizers, Main Courses, and Desserts tabs
   - **Reservations**: Complete a full reservation booking
   - **About**: Show the restaurant story, team, and milestones
   - **Gallery**: Filter photos by category, open lightbox

4. **Make a live reservation** to demonstrate the full flow

5. **Show the database** in MySQL to prove data persistence

6. **Show the Flask API** responding to curl requests in the terminal

---

## Troubleshooting

### "Connection refused" when making reservations
Make sure the Flask backend is running on port 5000 in Terminal 1.

### "Access denied" for MySQL
Double-check your MySQL username and password in the DATABASE_URL.

### Port 3000 or 5000 already in use
Kill any existing processes:
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

### "Module not found" errors
Re-install dependencies:
```bash
pip3 install -r flask_backend/requirements.txt
pnpm install
```

### Frontend shows but API calls fail
Check that both servers are running. The React dev server on port 3000 proxies `/api/*` requests to Flask on port 5000.

---

## Project Files Summary

| File/Directory | Purpose |
|----------------|---------|
| `flask_backend/app.py` | Flask REST API (all backend logic) |
| `flask_backend/requirements.txt` | Python dependencies |
| `flask_backend/schema.sql` | Database creation script |
| `client/src/pages/` | React page components (Home, Menu, Reservations, About, Gallery) |
| `client/src/lib/api.ts` | Frontend API client (fetch calls to Flask) |
| `client/src/components/` | Shared components (Navbar, Footer) |
| `client/src/index.css` | Global styles and design tokens |
| `drizzle/schema.ts` | Database schema definition |
| `README.md` | Project documentation |
| `AI_TOOLS_SUMMARY.md` | AI tools usage document |
