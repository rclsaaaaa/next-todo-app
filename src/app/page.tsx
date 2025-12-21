import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getTodos } from "./actions/todo"
import { TodoItem } from "@/components/TodoItem"
import { AddTodoForm } from "@/components/AddTodoForm"

export default async function Home() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    const todos = await getTodos()

    return (
        <div className="max-w-3xl mx-auto px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-slate-800">My Tasks</h1>
                <p className="text-slate-500">
                    こんにちは、{session.user?.name || 'ゲスト'}さん。
                    {todos.length}個のタスクがあります。
                </p>
            </div>

            <div className="mb-8">
                <AddTodoForm />
            </div>

            <div className="space-y-4">
                {todos.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        タスクはまだありません
                    </div>
                ) : (
                    todos.map((todo) => (
                        <TodoItem key={todo.id} todo={todo} />
                    ))
                )}
            </div>
        </div>
    )
}
