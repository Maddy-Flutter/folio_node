# Folio Node Backend

A Node.js and Express RESTful API backend integrated with MongoDB Atlas, designed for seamless execution across both **Local Development** and **Render Production** environments.

---

## Architecture Overview

```
LOCAL ENVIRONMENT:
Flutter App (Local)
      ↓
http://localhost:3000
      ↓
Node.js / Express (Local)
      ↓
MongoDB Atlas

PRODUCTION ENVIRONMENT:
Flutter App (Production)
      ↓
https://folio-node.onrender.com
      ↓
Render Web Service (Node.js / Express)
      ↓
MongoDB Atlas
```

---

## Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **MongoDB Atlas**: An active cluster connection string

---

## 1. Environment Configuration

### Local Environment (`.env`)

1. In the project root, copy the template file `.env.example` to create your local `.env`:

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your values:

   ```properties
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   CLIENT_URL=http://localhost:3000
   ```

> **Security Note:** Never commit your `.env` file to Git. It is already included in `.gitignore`. Real credentials should only exist in your local `.env` and in the Render Dashboard environment settings.

### Environment Variables Reference

| Variable | Required | Default (if unset) | Description |
| :--- | :---: | :--- | :--- |
| `PORT` | No | `3000` | Port on which the HTTP server listens. On Render, this is injected automatically. |
| `NODE_ENV` | No | `development` | Set to `production` on Render to enable sanitized error messages. |
| `MONGODB_URI` | **Yes** | — | MongoDB Atlas connection string. (`MONGO_URI` is also supported as a fallback). |
| `CLIENT_URL` | No | `*` | Allowed CORS origins (comma-separated for multiple origins, or `*` to allow any origin). |

---

## 2. How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server

- **Development Mode (Auto-reloads on file changes):**
  ```bash
  npm run dev
  ```

- **Standard Production Mode:**
  ```bash
  npm start
  ```

### Expected Startup Output
```text
MongoDB connected successfully
Server running on port 3000
```

---

## 3. API Endpoints

### Health & Diagnostic
| Method | Endpoint | Description | Sample Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Root server status | `{"status":"ok","environment":"development"}` |
| `GET` | `/health` | Health check endpoint | `{"status":"ok","environment":"development"}` |

### Users API (`/api/users`)
| Method | Endpoint | Description | Request Body | Success Status |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/users` | Create a user | `{"name":"Alex","email":"alex@example.com","age":28}` | `201 Created` |
| `GET` | `/api/users` | Get all users | — | `200 OK` |
| `GET` | `/api/users/:id` | Get user by ID | — | `200 OK` |
| `PUT` | `/api/users/:id` | Update user by ID | `{"name":"Alex Updated","age":29}` | `200 OK` |
| `DELETE` | `/api/users/:id` | Delete user by ID | — | `200 OK` |

### Sample cURL Requests
```bash
# Health Check
curl http://localhost:3000/health

# Get All Users
curl http://localhost:3000/api/users

# Create User
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","age":30}'
```

---

## 4. Production Deployment (Render)

- **Production API URL:** `https://folio-node.onrender.com`

### Render Dashboard Settings
1. Go to your [Render Dashboard](https://dashboard.render.com).
2. Select your `folio-node` Web Service.
3. Configure the **Build & Start Commands**:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. In the **Environment** tab, set the following environment variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<your_mongodb_atlas_connection_string>`
   - `CLIENT_URL`: `<your_frontend_url>` (or `*`)

*(Note: Render assigns `PORT` automatically; the server binds to `0.0.0.0` on that port dynamically).*

---

## 5. Connecting with Flutter

When integrating with a Flutter client application, centralize the API base URL using `String.fromEnvironment`:

### Flutter Configuration File (`lib/config/api_config.dart`)
```dart
class ApiConfig {
  static const String _rawBaseUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://localhost:3000',
  );

  /// Normalized base URL without trailing slash to prevent double slashes
  static String get baseUrl {
    return _rawBaseUrl.endsWith('/')
        ? _rawBaseUrl.substring(0, _rawBaseUrl.length - 1)
        : _rawBaseUrl;
  }

  // Endpoints
  static String get usersEndpoint => '$baseUrl/api/users';
  static String get healthEndpoint => '$baseUrl/health';
}
```

### Running Flutter Commands

- **Local Development (macOS/Windows/Web/iOS Simulator):**
  ```bash
  flutter run --dart-define=API_URL=http://localhost:3000
  ```

- **Local Development (Android Emulator):**
  *(Android Emulator maps host machine `localhost` to `10.0.2.2`)*
  ```bash
  flutter run --dart-define=API_URL=http://10.0.2.2:3000
  ```

- **Production Run (Render API):**
  ```bash
  flutter run --dart-define=API_URL=https://folio-node.onrender.com
  ```

- **Production Android APK Build:**
  ```bash
  flutter build apk --release --dart-define=API_URL=https://folio-node.onrender.com
  ```

- **Production Android App Bundle Build:**
  ```bash
  flutter build appbundle --release --dart-define=API_URL=https://folio-node.onrender.com
  ```

---

## 6. Project Structure

```text
folio_node/
├── config/
│   ├── db.js             # Mongoose MongoDB connection & error handling
│   └── env.js            # Centralized environment configuration
├── controllers/
│   └── user_controller.js# Request handlers for /api/users
├── models/
│   └── user.js           # Mongoose User schema & model
├── routes/
│   ├── auth_routes.js    # Auth routes placeholder
│   └── user_routes.js    # Express router for /api/users
├── .env                  # Local secrets (ignored in Git)
├── .env.example          # Environment variable template
├── .gitignore            # Git ignore rules for node_modules and .env
├── package.json          # Dependencies and scripts (dev, start)
├── README.md             # Project documentation
└── server.js             # Server entry point, CORS, routes & 0.0.0.0 listener
```
