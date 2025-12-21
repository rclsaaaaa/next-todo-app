'use server'

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

// Helper to get current user ID strictly
async function getCurrentUserId() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }
    return session.user.id
}

export async function getTodos() {
    const userId = await getCurrentUserId()
    return prisma.todo.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    })
}

export async function createTodo(formData: FormData) {
    const userId = await getCurrentUserId()
    const title = formData.get("title") as string
    const dueDateStr = formData.get("dueDate") as string
    const description = formData.get("description") as string

    if (!title) return { error: "タイトルは必須です" }

    try {
        const dueDate = dueDateStr ? new Date(dueDateStr) : new Date()

        await prisma.todo.create({
            data: {
                title,
                description,
                dueDate,
                userId,
            },
        })
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        return { error: "タスクの作成に失敗しました" }
    }
}

export async function toggleTodo(id: number, completed: boolean) {
    const userId = await getCurrentUserId()

    // Verify ownership implicitly via where clause with userId
    const count = await prisma.todo.count({ where: { id, userId } })
    if (count === 0) return { error: "Not found" }

    await prisma.todo.update({
        where: { id },
        data: { completed },
    })
    revalidatePath("/")
    return { success: true }
}

export async function deleteTodo(id: number) {
    const userId = await getCurrentUserId()

    const count = await prisma.todo.count({ where: { id, userId } })
    if (count === 0) return { error: "Not found" }

    await prisma.todo.delete({
        where: { id },
    })
    revalidatePath("/")
    return { success: true }
}
