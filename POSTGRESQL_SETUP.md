# 🗄️ PostgreSQL Setup Guide - Mind Trap

## 🎯 Quick Summary

This project uses **PostgreSQL running locally on your computer** (NOT Supabase cloud).

- **What:** PostgreSQL 12+ database server
- **Where:** Running on `localhost:5432`
- **Database Name:** `mindtrap`
- **Default User:** `postgres`
- **Default Password:** `postgres`

---

## 📥 Installation

### Step 1: Download PostgreSQL
1. Go to: https://www.postgresql.org/download/windows/
2. Click on the latest PostgreSQL version
3. Download the installer (.exe file)

### Step 2: Run Installer
1. Double-click the downloaded `.exe` file
2. Follow the wizard:
   - Accept license ✅
   - Choose installation directory (default is fine)
   - Components: Select all ✅
   - Data Directory: Default is fine
   - Superuser Password: **Use `postgres` for development**
   - Port: Keep default `5432`
   - Locale: Default is fine
3. Click "Install"
4. During final screen, **UNCHECK** "Stack Builder" (optional)
5. Click "Finish"

### Step 3: Verify Installation
```powershell
psql --version
# Should output: psql (PostgreSQL) XX.XX
```

---

## 🔧 Create the Application Database

After PostgreSQL is installed, create the `mindtrap` database.

### Method 1: PowerShell (Easiest)
```powershell
# Connect to PostgreSQL as postgres user
psql -U postgres

# You'll see: postgres=#
# Paste this command:
CREATE DATABASE mindtrap;

# You'll see: CREATE DATABASE
# Then exit:
\q
```

### Method 2: Using pgAdmin 4 (GUI)
1. Open pgAdmin 4 (installed with PostgreSQL)
2. Left panel → Databases → Right-click → Create → Database
3. Name: `mindtrap`
4. Click "Save"

### Method 3: Command Line
```powershell
# One command to create database without interactive prompt:
psql -U postgres -c "CREATE DATABASE mindtrap;"
```

### Verify Database Created
```powershell
# List all databases
psql -U postgres -l

# You should see "mindtrap" in the list
```

---

## 🔑 Connection Details

The backend uses these credentials to connect to PostgreSQL:

```
Host: localhost
Port: 5432
Database: mindtrap
Username: postgres
Password: postgres
```

These are set in `start-backend.ps1`:
```powershell
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/mindtrap"
$env:DATABASE_USERNAME="postgres"
$env:DATABASE_PASSWORD="postgres"
```

---

## ✅ Verify PostgreSQL is Running

### Check Service Status
```powershell
# Windows PowerShell - check if PostgreSQL service is running
Get-Service postgresql-x64* | Select Name, Status

# Should show: Status = Running
```

### Manual Connection Test
```powershell
# Try to connect to the database
psql -U postgres -d mindtrap -c "SELECT 1;"

# If it works, you'll see:
#  ?column?
# ----------
#          1
```

### From Windows Services
1. Press `Win + R`
2. Type: `services.msc`
3. Search for "postgresql"
4. Right-click → Properties
5. Check Status = "Running"
6. Startup Type = "Automatic"

---

## 🚀 Start PostgreSQL

### Automatic (Recommended)
PostgreSQL should start automatically when Windows boots.

### Manual Start
```powershell
# If service stopped, start it:
Start-Service postgresql-x64-16
# (Replace 16 with your PostgreSQL version)
```

---

## 🛠️ Common Operations

### Connect to Database
```powershell
psql -U postgres -d mindtrap
```

### List All Databases
```powershell
psql -U postgres -l
```

### List All Tables
```powershell
psql -U postgres -d mindtrap -c "\dt"
```

### Run SQL Query
```powershell
psql -U postgres -d mindtrap -c "SELECT * FROM users LIMIT 5;"
```

### Export Database
```powershell
pg_dump -U postgres mindtrap > mindtrap_backup.sql
```

### Import Database
```powershell
psql -U postgres mindtrap < mindtrap_backup.sql
```

---

## 🔐 Change Password (Optional)

For production, change the default password:

```powershell
# Connect to PostgreSQL
psql -U postgres

# Change password (in psql prompt):
ALTER USER postgres WITH PASSWORD 'new_secure_password';

# Exit
\q
```

Then update `start-backend.ps1`:
```powershell
$env:DATABASE_PASSWORD="new_secure_password"
```

---

## 🆘 Troubleshooting

### PostgreSQL Service Won't Start
```powershell
# Check service details
Get-Service postgresql-x64* | Format-List

# If issues, restart the service:
Stop-Service postgresql-x64-16
Start-Service postgresql-x64-16
```

### Connection Refused
```powershell
# Verify service is running
Get-Service postgresql-x64* | Select Status

# Verify port 5432 is listening:
netstat -ano | findstr :5432
```

### Forgot Superuser Password
1. Stop PostgreSQL service
2. Open: `C:\Program Files\PostgreSQL\XX\data\postgresql.conf`
3. Find line: `#password_encryption = 'scram-sha-256'`
4. Add new line: `trust` in `pg_hba.conf`
5. Restart PostgreSQL
6. Reset password: `ALTER USER postgres WITH PASSWORD 'postgres';`
7. Revert the config changes

### Database Already Exists Error
```powershell
# The mindtrap database already exists, skip creation
# Just verify it exists:
psql -U postgres -l | findstr mindtrap
```

---

## 📊 Using pgAdmin 4 (GUI Database Manager)

pgAdmin 4 is installed with PostgreSQL and provides a web interface:

1. Click Windows Start menu → PostgreSQL XX → pgAdmin 4
2. Browser opens to: http://localhost:5050
3. Login with master password (set during installation)
4. Left panel → Servers → PostgreSQL XX
5. Browse databases, tables, run queries via GUI

---

## 🔄 Database Migrations

When you start the backend for the first time, Spring Boot automatically:
1. Creates necessary tables
2. Applies migrations from `backend/src/main/resources`
3. Seeds initial data if needed

You don't need to manually create tables - Spring Data JPA handles this!

---

## 📝 Notes

⚠️ **Important:**
- Keep PostgreSQL running while developing
- Use `postgres` / `postgres` credentials for development only
- Change password for production deployments
- Regular backups are recommended for important data
- Database will persist between sessions

✅ **Good Practice:**
- Check service is running before starting backend
- Test connection occasionally: `psql -U postgres -d mindtrap -c "SELECT 1;"`
- Monitor disk space for database growth
- Keep PostgreSQL updated

---

## 🎓 Learn More

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- pgAdmin Documentation: https://www.pgadmin.org/docs/
- Connection Strings: https://www.postgresql.org/docs/current/libpq-connect-using.html

---

**Ready? Start the application with: `.\start-all.ps1`** ✨
