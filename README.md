# Cafe Fausse - Fine Dining Restaurant Website

A full-stack web application for an elegant fine-dining restaurant, built with a **React** frontend and a **Flask/Python** backend connected to a **MySQL** database. The application features a reservation system, categorized menu display, photo gallery, and newsletter signup functionality.

## Project Overview

Cafe Fausse is a sophisticated restaurant website that provides customers with an immersive digital experience reflecting the elegance and quality of a fine-dining establishment. The project demonstrates the integration of a modern React single-page application with a Python Flask REST API backend.

### Key Features

- **Home Page**: Elegant landing page with hero section, restaurant highlights, awards showcase, and newsletter signup
- **Menu Page**: Categorized menu display (Appetizers, Main Courses, Desserts) with pricing and dietary information
- **Reservations Page**: Full-featured booking system with date/time selection, availability checking, and confirmation
- **About Page**: Restaurant story, team profiles, milestones timeline, and awards recognition
- **Gallery Page**: Photo showcase with category filtering and lightbox viewer

### Technical Highlights

- Real-time table availability checking across 30 tables
- Random table assignment algorithm to distribute reservations evenly
- Newsletter subscription with duplicate detection
- Responsive design optimized for desktop, tablet, and mobile devices
- Elegant typography using Cormorant Garamond and Montserrat fonts
- Flask REST API with proper input validation and error handling

## Technology Stack

### Frontend
- **React 19** with JSX - UI component library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework with Flexbox and Grid layouts
- **Wouter** - Lightweight client-side routing
- **Radix UI** - Accessible component primitives (Dialog, Select, Calendar, Checkbox)
- **Lucide React** - Icon library
- **date-fns** - Date manipulation utilities

### Backend
- **Flask** (Python) - Lightweight web framework for the REST API
- **Flask-CORS** - Cross-origin resource sharing support
- **PyMySQL** - MySQL database connector for Python

### Database
- **MySQL** - Relational database for persistent storage
- Tables: Customers, Reservations, Newsletter Subscribers

## Database Schema

### Customers Table
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto-increment |
| name | VARCHAR(255) | Customer's full name |
| email | VARCHAR(320) | Unique email address |
| phone | VARCHAR(50) | Contact phone number |
| newsletterSignup | BOOLEAN | Newsletter subscription status |
| createdAt | TIMESTAMP | Record creation time |
| updatedAt | TIMESTAMP | Last update time |

### Reservations Table
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto-increment |
| customerId | INT | Foreign key to customers |
| reservationDate | VARCHAR(10) | Date in YYYY-MM-DD format |
| timeSlot | VARCHAR(5) | Time in HH:MM format |
| tableNumber | INT | Assigned table (1-30) |
| guestCount | INT | Number of guests (1-10) |
| status | ENUM | confirmed, cancelled, completed |
| specialRequests | TEXT | Optional special requests |
| createdAt | TIMESTAMP | Record creation time |
| updatedAt | TIMESTAMP | Last update time |

### Newsletter Subscribers Table
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto-increment |
| email | VARCHAR(320) | Unique email address |
| name | VARCHAR(255) | Subscriber's name (optional) |
| isActive | BOOLEAN | Active subscription status |
| subscribedAt | TIMESTAMP | Subscription time |

## Architecture

The application follows a client-server architecture:

```
                  ┌─────────────────────┐
                  │   React Frontend    │
                  │  (Port 3000/Vite)   │
                  └────────┬────────────┘
                           │
                    fetch /api/*
                           │
                  ┌────────▼────────────┐
                  │   Flask Backend     │
                  │    (Port 5000)      │
                  └────────┬────────────┘
                           │
                      PyMySQL
                           │
                  ┌────────▼────────────┐
                  │   MySQL Database    │
                  └─────────────────────┘
```

The React frontend makes standard `fetch()` calls to the Flask REST API. In development, an Express proxy forwards `/api/*` requests from port 3000 to the Flask server on port 5000.

## Flask API Endpoints

### Reservation Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reservations/available-slots?date=YYYY-MM-DD` | Get availability for all time slots on a date |
| GET | `/api/reservations/check-availability?date=YYYY-MM-DD&timeSlot=HH:MM` | Check availability for a specific slot |
| POST | `/api/reservations/create` | Create a new reservation |
| POST | `/api/reservations/cancel` | Cancel a reservation by ID |
| GET | `/api/reservations` | List all reservations (admin) |

### Newsletter Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/newsletter/subscribe` | Subscribe to the newsletter |
| GET | `/api/newsletter/subscribers` | List all active subscribers (admin) |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API and database status |

### Example: Create Reservation

**Request:**
```json
POST /api/reservations/create
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "(212) 555-0123",
  "date": "2026-02-10",
  "timeSlot": "19:00",
  "guestCount": 4,
  "specialRequests": "Window seat please",
  "newsletterSignup": true
}
```

**Response:**
```json
{
  "success": true,
  "reservation": {
    "id": 1,
    "date": "2026-02-10",
    "timeSlot": "19:00",
    "tableNumber": 14,
    "guestCount": 4
  },
  "message": "Your table has been reserved! Table #14 on 2026-02-10 at 19:00."
}
```

## Local Development Setup

### Prerequisites
- **Node.js 18+** and **pnpm** package manager (for the React frontend)
- **Python 3.9+** (for the Flask backend)
- **MySQL** or compatible database (MySQL 8.0, TiDB, MariaDB)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cafe-fausse.git
cd cafe-fausse
```

2. Install frontend dependencies:
```bash
pnpm install
```

3. Install Python dependencies:
```bash
pip install -r flask_backend/requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials:
# DATABASE_URL=mysql://user:password@host:port/database
```

5. Push database schema:
```bash
pnpm db:push
```

6. Start the Flask backend:
```bash
DATABASE_URL=mysql://user:password@host:port/database python flask_backend/app.py
```

7. Start the React frontend (in a separate terminal):
```bash
pnpm dev
```

8. Open http://localhost:3000 in your browser

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start React dev server with hot reload (port 3000) |
| `python flask_backend/app.py` | Start Flask API server (port 5000) |
| `pnpm build` | Build React frontend for production |
| `pnpm test` | Run test suite (Vitest) |
| `pnpm db:push` | Push schema changes to database |
| `pnpm check` | TypeScript type checking |

## Project Structure

```
cafe-fausse/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components (Navbar, Footer)
│   │   ├── pages/             # Page components (Home, Menu, Reservations, About, Gallery)
│   │   ├── lib/
│   │   │   └── api.ts         # Flask API client (fetch-based)
│   │   ├── App.tsx            # Main app with routing
│   │   └── index.css          # Global styles and design tokens
│   └── index.html             # HTML template with Google Fonts
├── flask_backend/             # Flask Backend
│   ├── app.py                 # Flask application with all API routes
│   └── requirements.txt       # Python dependencies
├── server/
│   ├── db.ts                  # Database queries (Drizzle ORM)
│   ├── routers.ts             # tRPC routers (legacy, kept for reference)
│   └── *.test.ts              # Test files (Vitest)
├── drizzle/
│   └── schema.ts              # Database schema definition
└── shared/                    # Shared types and constants
```

## Design System

### Color Palette
- **Primary**: Deep burgundy/wine (#5c1a1a) - Reflects sophistication
- **Accent**: Warm gold (#c4a35a) - Adds elegance
- **Background**: Warm cream (#faf8f5) - Creates warmth
- **Text**: Rich brown (#2d2420) - Ensures readability

### Typography
- **Headings**: Cormorant Garamond - Elegant serif for titles
- **Body**: Montserrat - Clean sans-serif for readability

### Layout
- CSS Flexbox for navigation and component layouts
- CSS Grid for gallery, menu cards, and multi-column sections
- Responsive breakpoints for mobile, tablet, and desktop

## Testing

The project includes comprehensive tests for backend functionality:

```bash
pnpm test
```

Tests cover:
- Flask API contract validation (endpoint URLs, request/response structures)
- Reservation availability checking logic
- Reservation creation with new and existing customers
- Newsletter subscription and duplicate handling
- Input validation for dates, times, emails, and guest counts
- Authentication logout functionality

## Deployment

### Production Build

Build the React frontend:
```bash
pnpm build
```

Run the Flask backend:
```bash
DATABASE_URL=mysql://user:password@host:port/database python flask_backend/app.py
```

For production deployments, use a WSGI server like Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 flask_backend.app:app
```

## License

MIT License

## Acknowledgments

- Photography from [Unsplash](https://unsplash.com)
- Icons from [Lucide React](https://lucide.dev)
- UI components from [Radix UI](https://www.radix-ui.com)
- Calendar component from [React Day Picker](https://react-day-picker.js.org)
