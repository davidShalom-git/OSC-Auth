import mongoose from 'mongoose'
import { IAdapter } from './IAdapter'

const blacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '15m' }
})

export function createMongoAdapter(UserModel: any): IAdapter {


  const BlacklistModel = mongoose.models.Blacklist || 
    mongoose.model('Blacklist', blacklistSchema)

  return {
    async findUserByEmail(email: string) {
      return UserModel.findOne({ email })
    },

    async createUser(data: any) {
      const user = new UserModel(data)
      await user.save()
      return user
    },

    async isTokenBlacklisted(token: string) {
      const found = await BlacklistModel.findOne({ token })
      return !!found
    },

    async blacklistToken(token: string) {
      await BlacklistModel.create({ token })
    }
  }
}