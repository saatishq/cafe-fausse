-- Cafe Fausse Database Schema (PostgreSQL)
-- Run this script to create the required tables in your local PostgreSQL database.
-- Usage: psql -U postgres -d cafe_fausse -f schema_postgres.sql

-- Create the database first (run this separately if needed):
-- CREATE DATABASE cafe_fausse;

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(320) NOT NULL UNIQUE,
    phone VARCHAR(20),
    "newsletterSignup" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    "customerId" INT NOT NULL REFERENCES customers(id),
    "reservationDate" VARCHAR(10) NOT NULL,
    "timeSlot" VARCHAR(5) NOT NULL,
    "tableNumber" INT NOT NULL,
    "guestCount" INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed',
    "specialRequests" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS "newsletterSubscribers" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(320) NOT NULL UNIQUE,
    name VARCHAR(255),
    "subscribedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE
);
