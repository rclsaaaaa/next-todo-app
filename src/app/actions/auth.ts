'use server'

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/lib/mail"
import crypto from "crypto"

// Step 1: Generate Code & Send Email
export async function sendVerificationCode(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
        return { error: "メールアドレスとパスワードは必須です" }
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return { error: "このメールアドレスは既に使用されています" }
        }

        // Generate 6-digit code
        const token = crypto.randomInt(100000, 999999).toString()
        const expires = new Date(new Date().getTime() + 10 * 60 * 1000) // 10 minutes

        // Save token to DB (upsert to overwrite old token if retry)
        // Using deleteMany + create because identifier is not unique in schema (though compound is)
        // Ideally we delete old tokens for this email first
        await prisma.verificationToken.deleteMany({
            where: { identifier: email }
        })

        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires,
            }
        })

        // Send Email
        const mailResult = await sendVerificationEmail(email, token)
        if (mailResult.error) {
            return { error: mailResult.error }
        }

        return { success: true }
    } catch (error) {
        console.error("Verification setup error:", error)
        return { error: "認証コードの送信に失敗しました" }
    }
}

// Step 2: Verify Code & Create User
export async function verifyAndRegister(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const code = formData.get("code") as string
    const name = formData.get("name") as string

    if (!email || !password || !code) {
        return { error: "必要な情報が不足しています" }
    }

    try {
        // Verify Token
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                identifier: email,
                token: code,
            }
        })

        if (!verificationToken) {
            return { error: "無効な認証コードです" }
        }

        if (new Date() > verificationToken.expires) {
            return { error: "認証コードの有効期限が切れています" }
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create User
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        })

        // Cleanup used token
        await prisma.verificationToken.deleteMany({
            where: { identifier: email }
        })

        return { success: true }
    } catch (error) {
        console.error("Registration error:", error)
        return { error: "登録処理に失敗しました" }
    }
}
