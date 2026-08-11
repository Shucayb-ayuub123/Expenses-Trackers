import { eq } from "drizzle-orm"
import db from "../db/index.js"
import { usersTable } from "../db/schema.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import crypto from "crypto"
import nodemailer from "nodemailer"
import "dotenv/config"
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"

const cookieOptions = (req) => {
    const origin = req.headers.origin
    const crossSite = origin && new URL(origin).host !== req.headers.host
    return {
        httpOnly: true,
        secure: crossSite || process.env.NODE_ENV === "production",
        sameSite: crossSite ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export const singUp = async (req, res) => {

    try {

        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.json({
                success: false,
                message: "Missing information"
            })
        }

        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email))

        if (user) {

            return res.json({
                success: false,
                message: "User already exists"
            })
        }

        const hashPasword = await bcrypt.hash(password, 10)

        const verificationToken = crypto.randomBytes(32).toString("hex")
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

        const [users] = await db.insert(usersTable).values({
            name: username,
            email,
            password: hashPasword,
            isVerified: false,
            verificationToken,
            verificationTokenExpires
        }).returning()

        const verifyUrl = `${FRONTEND_URL}/verify-email?token=${verificationToken}`

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Verify your email - Expense Tracker",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #333;">Welcome to Expense Tracker!</h2>
                        <p style="color: #555; font-size: 16px;">Hi ${username},</p>
                        <p style="color: #555; font-size: 16px;">Thank you for signing up. Please verify your email address by clicking the button below:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verifyUrl}" style="background: linear-gradient(to right, #2563eb, #06b6d4); color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">Verify Email</a>
                        </div>
                        <p style="color: #999; font-size: 14px;">This link expires in 24 hours.</p>
                        <p style="color: #999; font-size: 14px;">If you didn't create an account, you can safely ignore this email.</p>
                    </div>
                `
            })


        } catch (emailError) {
            console.log("Email sending failed:", emailError.message)
        }



        return res.json({
            success: true,
            message: "Account created. Please check your email to verify your account."
        })

    } catch (error) {

        return res.json({
            success: false,
            message: error.message
        })
    }


}

export const verifyEmail = async (req, res) => {

    try {

        const { token } = req.query

        if (!token) {
            return res.json({
                success: false,
                message: "Token is required"
            })
        }

        const [user] = await db.select().from(usersTable).where(eq(usersTable.verificationToken, token))

        if (!user) {
            return res.json({
                success: false,
                message: "Invalid token"
            })
        }

        if (user.isVerified) {
            return res.json({
                success: true,
                message: "Email is already verified"
            })
        }

        if (user.verificationTokenExpires && new Date() > new Date(user.verificationTokenExpires)) {
            return res.json({
                success: false,
                message: "Token has expired. Please request a new one."
            })
        }

        await db.update(usersTable).set({
            isVerified: true,
            verificationToken: null,
            verificationTokenExpires: null
        }).where(eq(usersTable.id, user.id))

          const authToken = jwt.sign({
            id: user.id,
            email: user.email
        },
            process.env.secretKey,

            {
                expiresIn: "7d"
            }
        )

         res.cookie("token", authToken, cookieOptions(req))

        return res.json({
            success: true,
            message: "Email verified successfully"
        })

    } catch (error) {

        return res.json({
            success: false,
            message: error.message
        })
    }
}

export const resendVerification = async (req, res) => {

    try {

        const { email } = req.body

        if (!email) {
            return res.json({
                success: false,
                message: "Email is required"
            })
        }

        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email))

        if (!user) {
            return res.json({
                success: false,
                message: "No account found with this email"
            })
        }

        if (user.isVerified) {
            return res.json({
                success: false,
                message: "Email is already verified"
            })
        }

        const verificationToken = crypto.randomBytes(32).toString("hex")
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

        await db.update(usersTable).set({
            verificationToken,
            verificationTokenExpires
        }).where(eq(usersTable.id, user.id))

        const verifyUrl = `${FRONTEND_URL}/verify-email?token=${verificationToken}`

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Verify your email - Expense Tracker",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #333;">Verify your email</h2>
                        <p style="color: #555; font-size: 16px;">Hi ${user.name},</p>
                        <p style="color: #555; font-size: 16px;">Click the button below to verify your email address:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verifyUrl}" style="background: linear-gradient(to right, #2563eb, #06b6d4); color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">Verify Email</a>
                        </div>
                        <p style="color: #999; font-size: 14px;">This link expires in 24 hours.</p>
                    </div>
                `
            })
        } catch (emailError) {
            console.log("Email sending failed:", emailError.message)
        }

        return res.json({
            success: true,
            message: "Verification email sent"
        })

    } catch (error) {

        return res.json({
            success: false,
            message: error.message
        })
    }
}

export const Login = async (req, res) => {

    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.json({
                success: false,
                message: "Missing information"
            })
        }

        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email))

        if (!user) {

            return res.json({
                success: false,
                message: "user not found"
            })
        }

        if (!user.isVerified) {
            return res.json({
                success: false,
                message: "Please verify your email before logging in"
            })
        }

        const Matched = await bcrypt.compare(password, user.password)

        if (!Matched) {

            return res.json({
                success: false,
                message: "invalid password"
            })

        }
        const token = jwt.sign({
            id: user.id,
            email: user.email
        },
            process.env.secretKey,

            {
                expiresIn: "7d"
            }
        )

        res.cookie("token", token, cookieOptions(req))

        return res.json({
            success: true,
            message: "successfully logged in"
        })

    } catch (error) {

        return res.json({
            success: false,
            message: error.message
        })
    }


}

export const Logout = (req,res) => {

    try {
        res.clearCookie("token", {
            ...cookieOptions(req),
            path: "/"
        })
        return res.json({ success: true, message: "Logged out" })
    } catch (error) {
         return res.json({ success: false, message: error.message })
    }
}


export const isAuth = (req,res) => {
    try {
        return res.json({
            success : true
        })
    } catch (error) {
        return res.json({
            success : false
        })
        
    }
}