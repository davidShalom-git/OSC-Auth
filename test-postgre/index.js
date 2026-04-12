require('dotenv').config()

const express = require('express')
const { Pool } = require('pg')
const { createAuth, createPostgresAdapter } = require('@opusity/auth')

const app = express()
app.use(express.json())

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

const auth = createAuth({
  adapter: createPostgresAdapter(pool)
})

app.post('/signup', auth.signUp)
app.post('/login', auth.login)
app.post('/logout', auth.logout)
app.get('/profile', auth.protect, (req, res) => {
  res.json({ user: req.user })
})

app.listen(3001, async () => {
  try {
    await pool.query('SELECT 1')
    console.log('PostgreSQL connected!')
    console.log('Server running on http://localhost:3001')
  } catch (err) {
    console.error('PostgreSQL connection error:', err.message)
  }
})