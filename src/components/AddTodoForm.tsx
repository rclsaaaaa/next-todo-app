'use client'

import { useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { createTodo } from '@/app/actions/todo'

export function AddTodoForm() {
    const formRef = useRef<HTMLFormElement>(null)
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        await createTodo(formData)
        formRef.current?.reset()
        setLoading(false)
        setIsOpen(false)
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full glass-panel p-4 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:text-primary hover:border-primary/50 transition-all border-dashed shadow-sm hover:shadow-md"
            >
                <Plus className="w-6 h-6" />
                <span className="font-semibold">新しいタスクを追加</span>
            </button>
        )
    }

    return (
        <form ref={formRef} action={handleSubmit} className="glass-panel p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 shadow-xl ring-1 ring-slate-900/5">
            <h3 className="text-lg font-bold mb-4 text-slate-800">新規タスク</h3>
            <div className="grid gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">タイトル</label>
                    <input name="title" type="text" className="input-field" required autoFocus />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">詳細</label>
                    <textarea name="description" className="input-field min-h-[80px]" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">期限</label>
                    <input name="dueDate" type="date" className="input-field" required defaultValue={new Date().toISOString().split('T')[0]} />
                </div>

                <div className="flex gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 btn-primary text-center justify-center shadow-lg shadow-indigo-200"
                    >
                        {loading ? '追加中...' : '追加する'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-6 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        キャンセル
                    </button>
                </div>
            </div>
        </form>
    )
}
