# Café Fausse Project TODO

## Pages
- [x] Home page (landing with hero, features, awards preview)
- [x] Menu page (categorized: appetizers, mains, desserts)
- [x] Reservations page (booking form with timeslot selection)
- [x] About Us page (owner highlights, restaurant story)
- [x] Gallery page (photo showcase)

## Backend & Database
- [x] Customers table (ID, Name, Email, Phone, Newsletter Signup)
- [x] Reservations table (ID, Customer ID, Time Slot, Table Number)
- [x] Reservation API (create, check availability, assign table)
- [x] Newsletter signup API (store subscriber data)
- [x] Customer data persistence

## Features
- [x] Table reservation system (30 tables)
- [x] Timeslot selection and validation
- [x] Guest count input
- [x] Random table assignment logic
- [x] Availability checking per timeslot
- [x] Newsletter email signup with validation
- [x] Contact information display (address, phone, hours)
- [x] Awards and reviews showcase

## Design & UI/UX
- [x] Elegant fine-dining color palette
- [x] Responsive CSS with Flexbox/Grid
- [x] Professional photography integration
- [x] Consistent visual identity across pages
- [x] Mobile-responsive design

## Documentation
- [x] README with solution description
- [x] Local setup instructions
- [x] AI tools usage summary

## Testing
- [x] Unit tests for reservation API
- [x] Unit tests for newsletter API
- [x] Input validation tests

## Flask Backend Migration
- [x] Create Flask app with REST API endpoints
- [x] Implement reservation endpoints (check availability, get slots, create reservation)
- [x] Implement newsletter subscribe endpoint
- [x] Connect Flask to same MySQL/TiDB database
- [x] Update React frontend to use fetch/axios instead of tRPC for Flask API
- [x] Test Flask backend end-to-end
- [x] Update README and documentation for Flask backend
