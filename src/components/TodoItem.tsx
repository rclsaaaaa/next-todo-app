'use client'

import { useState } from 'react'
import { Calendar, Trash2, Pencil, X, Save } from 'lucide-react'
import { deleteTodo, updateTodo } from '@/app/actions/todo'

type Todo = {
    id: number
    title: string
    description: string | null
    dueDate: Date
    status: string
}

const STATUS_MAP: Record<string, { label: string; color: string; bgColor: string }> = {
    NOT_STARTED: { label: '未着手', color: 'text-slate-600', bgColor: 'bg-slate-100 border-slate-200' },
    IN_PROGRESS: { label: '進行中', color: 'text-blue-700', bgColor: 'bg-blue-100 border-blue-200' },
    COMPLETED: { label: '完了', color: 'text-emerald-700', bgColor: 'bg-emerald-100 border-emerald-200' },
}

export function TodoItem({ todo }: { todo: Todo }) {
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(todo.title)
    const [editDescription, setEditDescription] = useState(todo.description || '')
    const [editStatus, setEditStatus] = useState(todo.status)
    const [editDueDate, setEditDueDate] = useState(
        new Date(todo.dueDate).toISOString().split('T')[0]
    )

    const handleDelete = async () => {
        if (!confirm('削除しますか？')) return
        setLoading(true)
        await deleteTodo(todo.id)
        setLoading(false)
    }

    const handleEdit = () => {
        setEditTitle(todo.title)
        setEditDescription(todo.description || '')
        setEditStatus(todo.status || 'NOT_STARTED')
        setEditDueDate(new Date(todo.dueDate).toISOString().split('T')[0])
        setIsEditing(true)
    }

    const handleSave = async () => {
        if (!editTitle.trim()) return
        setLoading(true)
        await updateTodo(todo.id, {
            title: editTitle.trim(),
            description: editDescription.trim(),
            status: editStatus,
            dueDate: editDueDate,
        })
        setIsEditing(false)
        setLoading(false)
    }

    const handleCancel = () => {
        setIsEditing(false)
    }

    if (isEditing) {
        return (
            <div className="glass-panel p-5 rounded-2xl mb-6 transition-all duration-300 shadow-xl ring-1 ring-primary/20">
                <div className="grid gap-3">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">タイトル</label>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="input-field"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">詳細</label>
                        <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="input-field min-h-[60px]"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">ステータス</label>
                            <select 
                                value={editStatus} 
                                onChange={(e) => setEditStatus(e.target.value)}
                                className="input-field cursor-pointer bg-white"
                            >
                                <option value="NOT_STARTED">未着手</option>
                                <option value="IN_PROGRESS">進行中</option>
                                <option value="COMPLETED">完了</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">期限</label>
                            <input
                                type="date"
                                value={editDueDate}
                                onChange={(e) => setEditDueDate(e.target.value)}
                                className="input-field"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-1 mt-2">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex-1 btn-primary text-center justify-center shadow-lg shadow-indigo-200 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? '保存中...' : '保存'}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-5 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            キャンセル
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const currentStatus = STATUS_MAP[todo.status || 'NOT_STARTED'] || STATUS_MAP['NOT_STARTED']
    const isCompleted = todo.status === 'COMPLETED'

    return (
        <div className={`glass-panel p-4 rounded-2xl mb-6 flex items-center gap-4 transition-all duration-300 ${isCompleted ? 'opacity-70 bg-slate-50' : 'hover:border-primary/50 hover:shadow-lg'}`}>

            {/* Status Badge */}
            <div className={`flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-bold border flex-shrink-0 w-20 text-center ${currentStatus.bgColor} ${currentStatus.color}`}>
                {currentStatus.label}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 ml-1">
                <h3 className={`font-semibold text-lg truncate ${isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
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

            {/* Edit Button */}
            <button
                onClick={handleEdit}
                disabled={loading}
                className="text-slate-400 hover:text-primary p-2 rounded-full hover:bg-indigo-50 transition-colors flex-shrink-0"
            >
                <Pencil className="w-5 h-5" />
            </button>

            {/* Delete Button */}
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
