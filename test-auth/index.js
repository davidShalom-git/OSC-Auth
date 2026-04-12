process.env.JWT_SECRET = 'supersecretkey123'
process.env.JWT_REFRESH_SECRET = 'refreshsecretkey123'
process.env.APP_URL = 'http://localhost:3000'
process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/auth-test'

const express = require('express')
const mongoose = require('mongoose')
const { createAuth, createMongoAdapter } = require('@opusity/auth')

const app = express()
app.use(express.json())

const UserModel = mongoose.model('User', new mongoose.Schema({
  username: String,
  email: String,
  password: String
}))

const auth = createAuth({
  adapter: createMongoAdapter(UserModel)
})

app.post('/signup', auth.signUp)
app.post('/login', auth.login)
app.post('/logout', auth.logout)
app.get('/profile', auth.protect, (req, res) => {
  res.json({ user: req.user })
})


mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected!')
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
  })
}).catch(err => {
  console.error('Connection error:', err)
})