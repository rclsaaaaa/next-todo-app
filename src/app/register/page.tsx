'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// import { User, Lock, Mail } from 'lucide-react'
import { registerUser } from '../actions/auth'

export default function RegisterPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)

        // Simple client-side validation
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (password !== confirmPassword) {
            setError('パスワードが一致しません')
            setLoading(false)
            return
        }

        try {
            const result = await registerUser(formData)

            if (result.error) {
                setError(result.error)
            } else {
                router.push('/login?registered=true')
            }
        } catch (err) {
            setError('エラーが発生しました')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
            {/* Background gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 via-white to-blue-50 -z-10"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-200/40 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[100px]"></div>

            <div className="glass-panel w-full max-w-md p-8 rounded-2xl">
                <h1 className="text-3xl font-bold text-center mb-2 text-slate-800">Create Account</h1>
                <p className="text-center text-slate-500 mb-8">無料でアカウントを作成</p>

                {error && (
                    <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600 ml-1">お名前 (任意)</label>
                        <div className="relative">
                            <input
                                name="name"
                                type="text"
                                className="input-field"
                                placeholder="Taro Yamada"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600 ml-1">メールアドレス</label>
                        <div className="relative">
                            <input
                                name="email"
                                type="email"
                                className="input-field"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600 ml-1">パスワード</label>
                        <div className="relative">
                            <input
                                name="password"
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                minLength={6}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600 ml-1">パスワード (確認)</label>
                        <div className="relative">
                            <input
                                name="confirmPassword"
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                    >
                        {loading ? '登録中...' : 'アカウント作成'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    すでにアカウントをお持ちですか？{' '}
                    <Link href="/login" className="text-primary hover:text-primary-hover font-bold transition-colors">
                        ログイン
                    </Link>
                </div>
            </div>
        </div>
    )
}
