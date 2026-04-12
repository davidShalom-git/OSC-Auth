import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/token'
import { IAdapter } from '../adapters/IAdapter'

declare global {
    namespace Express {
        interface Request {
            user?: { userId: string; email: string }
        }
    }
}

export function protectRoute(adapter: IAdapter) {
    return async function protect(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const authHeader = req.headers.authorization
            if (!authHeader || !authHeader.startsWith('Bearer')) {
                return res.status(401).json({ message: 'Unauthorized' })
            }

            const token = authHeader.split(' ')[1]

            const isBlacklisted = await adapter.isTokenBlacklisted(token)
            if (isBlacklisted) {
                return res.status(401).json({ message: 'Token expired, please login again' })
            }

            const decoded = verifyAccessToken(token)
            if (!decoded || typeof decoded === 'string') {
                return res.status(401).json({ message: 'Unauthorized' })
            }

            req.user = { userId: decoded.userId, email: decoded.email }
            next()

        } catch (error) {
            console.error('Error in protect:', error) 
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }
}