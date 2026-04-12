# @opusity/auth

> Plug in auth. Not boilerplate.

JWT authentication for Express.js — signup, login, logout, and route protection in minutes. Works with **MongoDB** and **PostgreSQL**. No repeated code. No setup headaches.

---

## Why @opusity/auth?

Every Express project needs auth. And every time, you write the same thing:
- Hash the password ✍️
- Check if user exists ✍️
- Generate a token ✍️
- Protect routes ✍️

Not anymore.

```js
app.post('/signup', auth.signUp)
app.post('/login', auth.login)
app.post('/logout', auth.logout)
app.get('/dashboard', auth.protect, handler)
```

That's it. Auth done.

---

## Install

```bash
npm install @opusity/auth
```

---

## Environment Variables

Add these to your `.env` file:

```env
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
APP_URL=http://localhost:3000
```

---

## Quick Start — MongoDB

```js
const express = require('express')
const mongoose = require('mongoose')
const { createAuth, createMongoAdapter } = require('@opusity/auth')

const app = express()
app.use(express.json())

// Your User model
const UserModel = mongoose.model('User', new mongoose.Schema({
  username: String,
  email: String,
  password: String
}))

// Create auth with MongoDB adapter
const auth = createAuth({
  adapter: createMongoAdapter(UserModel)
})

// Drop in your routes
app.post('/signup',   auth.signUp)
app.post('/login',    auth.login)
app.post('/logout',   auth.logout)
app.get('/profile',   auth.protect, (req, res) => {
  res.json({ user: req.user })
})

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(3000, () => console.log('Running on http://localhost:3000'))
})
```

---

## Quick Start — PostgreSQL

```js
const express = require('express')
const { Pool } = require('pg')
const { createAuth, createPostgresAdapter } = require('@opusity/auth')

const app = express()
app.use(express.json())

// Your PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// Create auth with PostgreSQL adapter
const auth = createAuth({
  adapter: createPostgresAdapter(pool)
})

// Drop in your routes
app.post('/signup',   auth.signUp)
app.post('/login',    auth.login)
app.post('/logout',   auth.logout)
app.get('/profile',   auth.protect, (req, res) => {
  res.json({ user: req.user })
})

app.listen(3000, () => console.log('Running on http://localhost:3000'))
```

### PostgreSQL — Required Tables

Run this once in your database before using the PostgreSQL adapter:

```sql
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(255) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password      VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blacklisted_tokens (
  id            SERIAL PRIMARY KEY,
  token         TEXT NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);
```

---

## What Each Method Does

| Method | Route | What happens |
|---|---|---|
| `auth.signUp` | `POST /signup` | Validates fields → hashes password → saves user → returns JWT tokens |
| `auth.login` | `POST /login` | Finds user → verifies password → returns access + refresh tokens |
| `auth.logout` | `POST /logout` | Verifies token → invalidates it |
| `auth.protect` | any route | Checks token → attaches `req.user` → calls `next()` |

---

## API Response Examples

**Signup / Login:**
```json
{
  "token": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "message": "User created successfully"
}
```

**Protected Route (`req.user`):**
```json
{
  "user": {
    "userId": "64abc...",
    "email": "david@example.com"
  }
}
```

---

## Security

- Passwords hashed with **bcryptjs** (salt rounds: 10)
- Short-lived **access tokens** (15 minutes)
- Long-lived **refresh tokens** (7 days)
- Token **blacklisting** on logout
- Protected routes reject expired or blacklisted tokens

---

## Built With

- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [nodemailer](https://www.npmjs.com/package/nodemailer)
- [pg](https://www.npmjs.com/package/pg)

---

## Author

Built by **David Shalom** — [@davidShalom-git](https://github.com/davidShalom-git)

Part of the **Opusity** ecosystem 🚀

---

## License

MIT
