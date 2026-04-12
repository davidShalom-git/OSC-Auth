import { Pool } from 'pg'
import { IAdapter } from './IAdapter'

export function createPostgresAdapter(pool: Pool): IAdapter {
  return {

    async findUserByEmail(email: string) {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      )
      return result.rows[0] || null
    },

    async createUser(data) {
      const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [data.username, data.email, data.password]
      )
      return result.rows[0]
    },

    async isTokenBlacklisted(token: string) {
      const result = await pool.query(
        'SELECT * FROM blacklisted_tokens WHERE token = $1',
        [token]
      )
      return result.rows.length > 0
    },

    async blacklistToken(token: string) {
      await pool.query(
        'INSERT INTO blacklisted_tokens (token) VALUES ($1)',
        [token]
      )
    }

  }
}