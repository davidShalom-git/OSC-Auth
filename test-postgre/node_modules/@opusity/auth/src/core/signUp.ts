import { Request, Response } from 'express'
import { hashPassword } from '../utils/hash'
import { generateAccessToken, generateRefreshToken } from '../utils/token';
import { sendEmail, verificationEmailTemplate } from '../utils/email';
import { IAdapter } from "../adapters/IAdapter";


export function createSignUp(adapter: IAdapter) {
    return async function signUp(req: Request, res: Response): Promise<Response> {
        try {

            const { username, email, password } = req.body;
            const verifyUrl = `${process.env.APP_URL}/verify?email=${email}`

            if (!username || !email || !password) {
                return res.status(400).json({ message: 'All Fields are required' })
            }

            const existingUser = await adapter.findUserByEmail(email)

            if (existingUser) {
                return res.status(400).json({ message: 'User Already Exists' })
            }

            const hashedPassword = await hashPassword(password)


            const newUser = await adapter.createUser({
                username,
                email,
                password: hashedPassword
            })


            const token = generateAccessToken({ userId: newUser._id || newUser.id, email: newUser.email })
            const refreshToken = generateRefreshToken({ userId: newUser._id || newUser.id, email: newUser.email })

            try {
                await sendEmail({
                    to: email,
                    subject: "Verify your email",
                    html: verificationEmailTemplate(username, verifyUrl)
                })
            } catch (emailError) {
                console.warn('Email sending failed, continuing anyway:', emailError)
            }

            return res.status(201).json({ token, refreshToken, message: "User created successfully" })


        } catch (error) {
            console.error('Error in signUp:', error);
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }
}


