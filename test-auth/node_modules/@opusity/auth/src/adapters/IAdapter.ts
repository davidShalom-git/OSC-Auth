export interface IAdapter {
  findUserByEmail(email: string): Promise<any>
  createUser(data: {
    username: string
    email: string
    password: string
  }): Promise<any>
  isTokenBlacklisted(token: string): Promise<boolean>
  blacklistToken(token: string): Promise<void>
}