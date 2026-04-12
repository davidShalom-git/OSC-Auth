import jwt from 'jsonwebtoken';


export interface TokenPayload {
    userId: string;
    email: string
}

export function generateAccessToken(payload:TokenPayload):string {
    const secret = process.env.JWT_SECRET!;
    return jwt.sign(payload, secret, {expiresIn: '1h'})
}

export function generateRefreshToken(payload: TokenPayload):string {
    const secret = process.env.JWT_REFRESH_SECRET!;
    return jwt.sign(payload,secret, {expiresIn: '7d'})
}

export function verifyAccessToken(token: string):TokenPayload {
    const secret = process.env.JWT_SECRET!;
     console.log('JWT_SECRET in package:', secret)
    return jwt.verify(token,secret) as unknown as TokenPayload;
}

export function verifyRefreshToken(token:string):TokenPayload {
    const secret = process.env.JWT_REFRESH_SECRET!;
    return jwt.verify(token,secret) as unknown as TokenPayload;
}