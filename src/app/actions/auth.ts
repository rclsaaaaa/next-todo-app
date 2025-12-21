'use server'

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function registerUser(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    if (!email || !password) {
        return { error: "メールアドレスとパスワードは必須です" }
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return { error: "このメールアドレスは既に使用されています" }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        })

        return { success: true }
    } catch (error) {
        console.error("Registration error:", error)
        return { error: "登録中にエラーが発生しました" }
    }
}
