
---

# FastAPI + Alembic Setup Guide

## 1. Create & Activate Virtual Environment

### Windows (PowerShell)

```powershell
# Create virtual environment (first time only)
python -m venv venv

# Activate the environment
.\venv\Scripts\Activate
```

### Linux/macOS

```bash
# Create virtual environment (first time only)
python3 -m venv venv

# Activate the environment
source venv/bin/activate
```

---

## 2. Environment Configuration

Create a `.env` file in the root directory with these contents.
Replace with your own database credentials if needed.

### Secret Key Generation

Run this to generate a new secret key and update it in `.env`:

```powershell
# Windows Powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

```ini
# Database
DB_DRIVER=postgresql+psycopg2
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=tvs_cta
 
# JWT
SECRET_KEY=15e7424c3000ee3f73a94b6df1b6c723b090be5e366610e919d6ac9d0b4bb1c8
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
 
# QR
QR_REDEEM_URL=http://localhost:8000/redeem?token=
```

---

## 3. Install Requirements

```bash
# Install all required packages from requirements.txt
pip install -r requirements.txt
```

---

## 4. Database Setup

1. Make sure PostgreSQL is running.
2. Create the database:

```sql
CREATE DATABASE tvs_cta;
```

---

## 5. Alembic Migrations

### After Model Changes

```bash
# Generate a new migration file by comparing models to database
alembic revision --autogenerate -m "describe your change"

# Apply the generated migration to update the database
alembic upgrade head
```

### When Pulling Updates

```bash
# Apply any new migrations that were added by other developers
alembic upgrade head
```

---

## 6. Create Default Admin User

Run this SQL query to insert the default admin user into the database:

```sql
INSERT INTO usermaster (
    t_no, name, designation, hq, responsibility,
    role, reports_to, status, email, mobile, password_hash,
    created_at, updated_at, address
) VALUES (
    1,
    'Admin',
    'Administrator',
    'Headquarters',
    'System Management',
    'admin',
    NULL,  -- no reports_to
    't',
    'admin@example.com',
    '1234567890',
    '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
    NOW(),
    NOW(),
    'pondy'
);
```

### Admin Credentials:

* **Username**: `admin@example.com`
* **Password**: `secret`

---

## 7. Run Application

```bash
# Start the FastAPI application with auto-reload for development
uvicorn app.main:app --reload
```

---

## Key Notes:

* Always activate your virtual environment before working
* The `.env` file contains sensitive credentials – never commit it to version control
* Run migrations after any model changes
* The `--reload` flag enables automatic restart on code changes (development only)
* Ensure PostgreSQL server is running before starting the application

---
