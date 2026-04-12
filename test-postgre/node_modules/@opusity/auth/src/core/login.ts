import { Request, Response } from 'express'
import { comparePassword} from '../utils/hash'
import { generateAccessToken,generateRefreshToken } from '../utils/token';
import { IAdapter } from "../adapters/IAdapter";


export function createLogin(adapter: IAdapter){
    return async function createlogin(req:Request,res:Response):Promise<Response>{
        try {

            const {email, password} = req.body;
            if(!email || !password){
                return res.status(400).json({message: "All Fields are required"})
            }

            const user = await adapter.findUserByEmail(email)
            if(!user){
                return res.status(400).json({message: "Invalid Credentials"})
            }

            const isMatchPassword = await comparePassword(password,user.password)

            if(!isMatchPassword){
                return res.status(400).json({message: "Invalid Credentials"})
            }

            const token = generateAccessToken({userId: user._id || user.id,email  : user.email})
            const refreshToken = generateRefreshToken({userId: user._id || user.id,email: user.email})
            return res.status(200).json({token, refreshToken, message: "Login successful"})
        } catch (error) {
            console.error('Error in login:', error);
            return res.status(500).json({message: "Internal Server Error"})
        }
    }
}