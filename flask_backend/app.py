"""
Cafe Fausse - Flask Backend API
A Flask/Python backend for the Cafe Fausse restaurant website.
Handles reservation management, customer data, and newsletter subscriptions.
Supports both MySQL (PyMySQL) and PostgreSQL (psycopg2) databases.
"""

import os
import re
import random
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ==================== DATABASE CONNECTION ====================

def parse_database_url(database_url):
    """
    Parse a database URL into connection parameters.
    Supports formats:
      mysql://user:password@host:port/database
      postgresql://user:password@host:port/database
      postgres://user:password@host:port/database
    """
    pattern = r"(?:mysql|postgres(?:ql)?)://([^:]+):([^@]*)@([^:]+):(\d+)/([^?]+)"
    match = re.match(pattern, database_url)
    if not match:
        raise Exception(f"Invalid DATABASE_URL format: {database_url}")
    user, password, host, port, database = match.groups()
    return {
        "user": user,
        "password": password,
        "host": host,
        "port": int(port),
        "database": database,
    }


def detect_db_type():
    """Detect whether we are using MySQL or PostgreSQL from the DATABASE_URL."""
    database_url = os.environ.get("DATABASE_URL", "")
    if database_url.startswith("postgres"):
        return "postgresql"
    return "mysql"


def get_db_connection():
    """
    Create and return a database connection using the DATABASE_URL environment variable.
    Automatically detects MySQL vs PostgreSQL from the URL scheme.
    """
    database_url = os.environ.get("DATABASE_URL", "")
    if not database_url:
        raise Exception("DATABASE_URL environment variable is not set")

    params = parse_database_url(database_url)
    db_type = detect_db_type()

    if db_type == "postgresql":
        import psycopg2
        import psycopg2.extras
        conn = psycopg2.connect(
            host=params["host"],
            port=params["port"],
            user=params["user"],
            password=params["password"],
            dbname=params["database"],
        )
        conn.autocommit = True
        return conn
    else:
        import pymysql
        import pymysql.cursors
        use_ssl = "ssl" in database_url.lower()
        ssl_config = None
        if use_ssl:
            ssl_config = {"ssl_verify_cert": False}
        conn = pymysql.connect(
            host=params["host"],
            port=params["port"],
            user=params["user"],
            password=params["password"],
            database=params["database"],
            cursorclass=pymysql.cursors.DictCursor,
            ssl=ssl_config,
            autocommit=True,
        )
        return conn


def dict_cursor(conn):
    """Return a cursor that produces dict-like rows for both MySQL and PostgreSQL."""
    db_type = detect_db_type()
    if db_type == "postgresql":
        import psycopg2.extras
        return conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    else:
        return conn.cursor()


def placeholder():
    """Return the correct placeholder for the current database type."""
    return "%s"


# ==================== CONSTANTS ====================

TOTAL_TABLES = 30

TIME_SLOTS = [
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00", "21:30"
]


# ==================== HELPER FUNCTIONS ====================

def validate_date(date_str):
    """Validate date is in YYYY-MM-DD format."""
    if not re.match(r"^\d{4}-\d{2}-\d{2}$", date_str):
        return False
    try:
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except ValueError:
        return False


def validate_time_slot(time_str):
    """Validate time slot is in HH:MM format."""
    return bool(re.match(r"^\d{2}:\d{2}$", time_str))


def validate_email(email):
    """Basic email validation."""
    return bool(re.match(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", email))


def get_available_tables(date, time_slot):
    """
    Get list of available table numbers for a given date and time slot.
    Checks existing confirmed reservations and returns unbooked tables.
    """
    conn = get_db_connection()
    try:
        cur = dict_cursor(conn)
        p = placeholder()
        cur.execute(
            f"SELECT \"tableNumber\" FROM reservations "
            f"WHERE \"reservationDate\" = {p} "
            f"AND \"timeSlot\" = {p} "
            f"AND status = 'confirmed'",
            (date, time_slot)
        )
        rows = cur.fetchall()
        taken_tables = {row["tableNumber"] for row in rows}
        available = [t for t in range(1, TOTAL_TABLES + 1) if t not in taken_tables]
        return available
    finally:
        conn.close()


def assign_random_table(date, time_slot):
    """
    Randomly assign an available table for the given date and time slot.
    Returns the table number, or None if no tables are available.
    """
    available = get_available_tables(date, time_slot)
    if not available:
        return None
    return random.choice(available)


# ==================== RESERVATION ENDPOINTS ====================

@app.route("/api/reservations/check-availability", methods=["GET"])
def check_availability():
    """
    Check table availability for a specific date and time slot.
    """
    date = request.args.get("date", "")
    time_slot = request.args.get("timeSlot", "")

    if not validate_date(date):
        return jsonify({"error": "Date must be in YYYY-MM-DD format"}), 400

    if not validate_time_slot(time_slot):
        return jsonify({"error": "Time slot must be in HH:MM format"}), 400

    available_tables = get_available_tables(date, time_slot)

    return jsonify({
        "available": len(available_tables) > 0,
        "availableCount": len(available_tables),
        "totalTables": TOTAL_TABLES,
    })


@app.route("/api/reservations/available-slots", methods=["GET"])
def get_available_slots():
    """
    Get availability for all time slots on a given date.
    """
    date = request.args.get("date", "")

    if not validate_date(date):
        return jsonify({"error": "Date must be in YYYY-MM-DD format"}), 400

    availability = []
    for slot in TIME_SLOTS:
        available_tables = get_available_tables(date, slot)
        availability.append({
            "timeSlot": slot,
            "available": len(available_tables) > 0,
            "availableCount": len(available_tables),
        })

    return jsonify(availability)


@app.route("/api/reservations/create", methods=["POST"])
def create_reservation():
    """
    Create a new reservation.
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    # Validate required fields
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    date = data.get("date", "").strip()
    time_slot = data.get("timeSlot", "").strip()
    guest_count = data.get("guestCount", 0)
    phone = data.get("phone", "").strip() or None
    special_requests = data.get("specialRequests", "").strip() or None
    newsletter_signup = data.get("newsletterSignup", False)

    # Validation
    if len(name) < 2:
        return jsonify({"error": "Name must be at least 2 characters"}), 400

    if not validate_email(email):
        return jsonify({"error": "Invalid email address"}), 400

    if not validate_date(date):
        return jsonify({"error": "Date must be in YYYY-MM-DD format"}), 400

    if not validate_time_slot(time_slot):
        return jsonify({"error": "Time slot must be in HH:MM format"}), 400

    if not isinstance(guest_count, int) or guest_count < 1 or guest_count > 10:
        return jsonify({"error": "Guest count must be between 1 and 10"}), 400

    # Assign a random table
    table_number = assign_random_table(date, time_slot)

    if table_number is None:
        return jsonify({
            "success": False,
            "error": "Sorry, all tables are booked for this time slot. Please select another time.",
        })

    conn = get_db_connection()
    try:
        cur = dict_cursor(conn)
        p = placeholder()

        # Check if customer already exists
        cur.execute(
            f"SELECT * FROM customers WHERE email = {p} LIMIT 1",
            (email,)
        )
        customer = cur.fetchone()

        if customer:
            # Update existing customer
            nl = newsletter_signup or customer["newsletterSignup"]
            cur.execute(
                f"UPDATE customers "
                f"SET name = {p}, phone = COALESCE({p}, phone), "
                f"\"newsletterSignup\" = {p} "
                f"WHERE id = {p}",
                (name, phone, nl, customer["id"])
            )
            customer_id = customer["id"]
        else:
            # Create new customer
            if detect_db_type() == "postgresql":
                cur.execute(
                    f"INSERT INTO customers (name, email, phone, \"newsletterSignup\") "
                    f"VALUES ({p}, {p}, {p}, {p}) RETURNING id",
                    (name, email, phone, newsletter_signup)
                )
                customer_id = cur.fetchone()["id"]
            else:
                cur.execute(
                    f"INSERT INTO customers (name, email, phone, \"newsletterSignup\") "
                    f"VALUES ({p}, {p}, {p}, {p})",
                    (name, email, phone, newsletter_signup)
                )
                customer_id = cur.lastrowid

        # Create reservation
        if detect_db_type() == "postgresql":
            cur.execute(
                f"INSERT INTO reservations "
                f"(\"customerId\", \"reservationDate\", \"timeSlot\", \"tableNumber\", \"guestCount\", \"specialRequests\") "
                f"VALUES ({p}, {p}, {p}, {p}, {p}, {p}) RETURNING id",
                (customer_id, date, time_slot, table_number, guest_count, special_requests)
            )
            reservation_id = cur.fetchone()["id"]
        else:
            cur.execute(
                f"INSERT INTO reservations "
                f"(\"customerId\", \"reservationDate\", \"timeSlot\", \"tableNumber\", \"guestCount\", \"specialRequests\") "
                f"VALUES ({p}, {p}, {p}, {p}, {p}, {p})",
                (customer_id, date, time_slot, table_number, guest_count, special_requests)
            )
            reservation_id = cur.lastrowid

        return jsonify({
            "success": True,
            "reservation": {
                "id": reservation_id,
                "date": date,
                "timeSlot": time_slot,
                "tableNumber": table_number,
                "guestCount": guest_count,
            },
            "message": f"Your table has been reserved! Table #{table_number} on {date} at {time_slot}.",
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Failed to create reservation: {str(e)}",
        }), 500
    finally:
        conn.close()


@app.route("/api/reservations", methods=["GET"])
def get_all_reservations():
    """
    Get all reservations with customer information (admin endpoint).
    """
    conn = get_db_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute(
            "SELECT r.*, c.name as \"customerName\", c.email as \"customerEmail\" "
            "FROM reservations r "
            "INNER JOIN customers c ON r.\"customerId\" = c.id "
            "ORDER BY r.\"reservationDate\", r.\"timeSlot\""
        )
        reservations = cur.fetchall()

        # Convert datetime objects to strings for JSON serialization
        result = []
        for r in reservations:
            row = dict(r)
            if isinstance(row.get("createdAt"), datetime):
                row["createdAt"] = row["createdAt"].isoformat()
            if isinstance(row.get("updatedAt"), datetime):
                row["updatedAt"] = row["updatedAt"].isoformat()
            result.append(row)

        return jsonify(result)
    finally:
        conn.close()


@app.route("/api/reservations/cancel", methods=["POST"])
def cancel_reservation():
    """
    Cancel a reservation by ID.
    """
    data = request.get_json()
    reservation_id = data.get("id")

    if not reservation_id:
        return jsonify({"error": "Reservation ID is required"}), 400

    conn = get_db_connection()
    try:
        cur = dict_cursor(conn)
        p = placeholder()
        cur.execute(
            f"UPDATE reservations SET status = 'cancelled' WHERE id = {p}",
            (reservation_id,)
        )
        return jsonify({"success": True})
    finally:
        conn.close()


# ==================== NEWSLETTER ENDPOINTS ====================

@app.route("/api/newsletter/subscribe", methods=["POST"])
def subscribe_newsletter():
    """
    Subscribe to the newsletter.
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    email = data.get("email", "").strip()
    name = data.get("name", "").strip() or None

    if not validate_email(email):
        return jsonify({"error": "Invalid email address"}), 400

    conn = get_db_connection()
    try:
        cur = dict_cursor(conn)
        p = placeholder()

        # Check if already subscribed
        cur.execute(
            f"SELECT id FROM \"newsletterSubscribers\" WHERE email = {p}",
            (email,)
        )
        existing = cur.fetchone()

        if existing:
            return jsonify({
                "success": True,
                "message": "You're already subscribed to our newsletter!",
            })

        cur.execute(
            f"INSERT INTO \"newsletterSubscribers\" (email, name) VALUES ({p}, {p})",
            (email, name)
        )
        return jsonify({
            "success": True,
            "message": "Thank you for subscribing to our newsletter!",
        })
    finally:
        conn.close()


@app.route("/api/newsletter/subscribers", methods=["GET"])
def get_newsletter_subscribers():
    """
    Get all active newsletter subscribers (admin endpoint).
    """
    conn = get_db_connection()
    try:
        cur = dict_cursor(conn)
        cur.execute(
            "SELECT * FROM \"newsletterSubscribers\" WHERE \"isActive\" = true"
        )
        subscribers = cur.fetchall()

        result = []
        for s in subscribers:
            row = dict(s)
            if isinstance(row.get("subscribedAt"), datetime):
                row["subscribedAt"] = row["subscribedAt"].isoformat()
            result.append(row)

        return jsonify(result)
    finally:
        conn.close()


# ==================== HEALTH CHECK ====================

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint to verify the API is running."""
    try:
        conn = get_db_connection()
        conn.close()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return jsonify({
        "status": "ok",
        "database": db_status,
        "timestamp": datetime.now().isoformat(),
    })


# ==================== MAIN ====================

if __name__ == "__main__":
    port = int(os.environ.get("FLASK_PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug)
