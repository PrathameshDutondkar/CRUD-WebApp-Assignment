# 👤 User Management System
### CRUD Assignment — Web Development

**Full-Stack:** React 18 (Frontend) + .NET 8 Web API (Backend) + Entity Framework Core + SQL Server


## 🚀 How to Run

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) **or** SQL Server LocalDB (ships with Visual Studio)

---

### Step 1 — Configure Database Connection

Open `backend/UserManagement/appsettings.json` and set your connection string:

**Option A — SQL Server LocalDB** (comes with Visual Studio, easiest):
```json
"DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=UserManagementDB;Trusted_Connection=True;TrustServerCertificate=True"
```

**Option B — SQL Server Express:**
```json
"DefaultConnection": "Server=.\\SQLEXPRESS;Database=UserManagementDB;Trusted_Connection=True;TrustServerCertificate=True"
```

**Option C — Full SQL Server with Windows Auth:**
```json
"DefaultConnection": "Server=YOUR_SERVER_NAME;Database=UserManagementDB;Trusted_Connection=True;TrustServerCertificate=True"
```

**Option D — SQL Server with Username/Password:**
```json
"DefaultConnection": "Server=YOUR_SERVER;Database=UserManagementDB;User Id=sa;Password=YourPassword;TrustServerCertificate=True"
```

---

### Step 2 — Set Up Database

#### Method A: EF Migrations (Recommended — automatic)
The app **automatically runs migrations on startup** — just run the app and the database is created!

Or manually:
```bash
cd backend/UserManagement
dotnet restore
dotnet ef database update
```

#### Method B: Manual SQL Script
Open SQL Server Management Studio and run `database_setup.sql` from the project root.

---

### Step 3 — Run the Backend

```bash
cd backend/UserManagement
dotnet restore
dotnet run
```

 API will be available at: **http://localhost:5000**
 Swagger UI at: **http://localhost:5000/swagger**

---

### Step 4 — Run the Frontend

```bash
cd frontend
npm install
npm start
```

App will open at: **http://localhost:3000**

---

## 📁 Project Structure

```
UserManagement_CRUD/
│
├── 📄 README.md                         ← This file
├── 📄 database_setup.sql                ← Manual SQL setup script
│
├── 📂 backend/UserManagement/
│   ├── 📄 UserManagement.csproj         ← NuGet packages
│   ├── 📄 Program.cs                    ← App startup, DI, CORS, auto-migrate
│   ├── 📄 appsettings.json              ← ⚙️ Connection string here
│   ├── 📄 appsettings.Development.json
│   │
│   ├── 📂 Models/
│   │   ├── User.cs                      ← Entity class (DB table)
│   │   └── UserFormDto.cs               ← Form data transfer object
│   │
│   ├── 📂 Data/
│   │   └── AppDbContext.cs              ← EF Core DbContext + seed data
│   │
│   ├── 📂 Controllers/
│   │   └── UsersController.cs           ← CRUD API endpoints
│   │
│   ├── 📂 Migrations/
│   │   ├── 20240101000000_InitialCreate.cs
│   │   └── AppDbContextModelSnapshot.cs
│   │
│   └── 📂 wwwroot/uploads/              ← Uploaded photos stored here
│
└── 📂 frontend/
    ├── 📄 package.json
    ├── 📂 public/index.html
    └── 📂 src/
        ├── index.js                     ← React entry point
        ├── index.css                    ← Global styles + CSS variables
        ├── App.js                       ← Main app component
        ├── App.css                      ← App layout styles
        │
        ├── 📂 components/
        │   ├── UserForm.js/.css         ← Add/Edit form
        │   ├── UserList.js/.css         ← Data grid
        │   └── ConfirmDialog.js/.css    ← Confirmation modal
        │
        └── 📂 services/
            └── api.js                   ← Axios API calls
```

---

## 🌐 API Endpoints

| Method | URL              | Description          | Body |
|--------|------------------|----------------------|------|
| GET    | /api/users       | Get all users        | — |
| GET    | /api/users/{id}  | Get user by ID       | — |
| POST   | /api/users       | Create new user      | multipart/form-data |
| PUT    | /api/users/{id}  | Update user          | multipart/form-data |
| DELETE | /api/users/{id}  | Delete user          | — |

Test all endpoints at: **http://localhost:5000/swagger**

---

## 🛠️ Technologies Used

| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | Frontend UI |
| Axios | 1.6 | HTTP client |
| .NET | 8.0 | Backend framework |
| ASP.NET Core Web API | 8.0 | REST API |
| Entity Framework Core | 8.0 | ORM / Database access |
| EF Core SqlServer | 8.0 | SQL Server provider |
| SQL Server / LocalDB | — | Database |
| Swashbuckle (Swagger) | 6.5 | API documentation |

---

## ⚠️ Troubleshooting

**"Cannot connect to backend"**
→ Make sure `dotnet run` is running in `backend/UserManagement`

**"Database connection failed"**
→ Check connection string in `appsettings.json`
→ For LocalDB: install SQL Server Express LocalDB from VS installer

**"Port already in use"**
→ Change ports in `launchSettings.json` (backend) or use `PORT=3001 npm start` (frontend)

**Photos not showing**
→ The `wwwroot/uploads` folder must exist — it is created automatically at runtime

---

*Built with — React + .NET 8 + Entity Framework Core + SQL Server*
