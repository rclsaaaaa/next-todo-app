'use client'

import { useState } from 'react'
import { Calendar, Trash2, CheckCircle, Circle } from 'lucide-react'
import { deleteTodo, toggleTodo } from '@/app/actions/todo'
import { useRouter } from 'next/navigation'

type Todo = {
    id: number
    title: string
    description: string | null
    dueDate: Date
    completed: boolean
}

export function TodoItem({ todo }: { todo: Todo }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter() // Re-fetch data on mutation

    const handleToggle = async () => {
        setLoading(true)
        await toggleTodo(todo.id, !todo.completed)
        setLoading(false)
    }

    const handleDelete = async () => {
        if (!confirm('削除しますか？')) return
        setLoading(true)
        await deleteTodo(todo.id)
        setLoading(false)
    }

    return (
        <div className={`glass-panel p-4 rounded-2xl mb-6 flex items-center gap-4 transition-all duration-300 ${todo.completed ? 'opacity-60 bg-slate-50' : 'hover:border-primary/50 hover:shadow-lg'}`}>

            {/* Checkbox */}
            <button 
                onClick={handleToggle}
                disabled={loading}
                className="text-primary hover:scale-110 transition-transform flex-shrink-0"
            >
                {todo.completed ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
            </button>

            {/* Task Number */}
            <div className="bg-slate-100 text-slate-500 text-xs font-mono px-2 py-1 rounded">
                #{todo.id}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-lg truncate ${todo.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {todo.title}
                </h3>
                {todo.description && (
                    <p className="text-sm text-slate-500 truncate">{todo.description}</p>
                )}
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg whitespace-nowrap hidden sm:flex border border-slate-100">
                <Calendar className="w-4 h-4" />
                {new Date(todo.dueDate).toLocaleDateString('ja-JP')}
            </div>

            {/* Actions */}
            <button 
                onClick={handleDelete}
                disabled={loading}
                className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors flex-shrink-0"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    )
}
