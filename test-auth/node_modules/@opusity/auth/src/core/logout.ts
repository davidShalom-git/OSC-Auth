import { Request, Response } from 'express'
import { verifyAccessToken } from '../utils/token'
import { IAdapter } from '../adapters/IAdapter'


export function createLogout(adapter: IAdapter) {
    return async function (req: Request, res: Response): Promise<Response> {
        try {

            const authHeader = req.headers.authorization

            if (!authHeader || !authHeader.startsWith('Bearer')) {
                return res.status(401).json({ message: "Unauthorized" })
            }

            const token = authHeader.split(' ')[1]
            console.log('Token received:', token)
            console.log('Token length:', token.length)
            const decoded = verifyAccessToken(token)
            const userId = decoded.userId
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" })
            }
            await adapter.blacklistToken(token)
            return res.status(200).json({ message: "Logout Successfully" })


        } catch (error) {
            console.error('Error in logout:', error)
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }
}