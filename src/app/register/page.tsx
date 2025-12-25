'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// import { User, Lock, Mail } from 'lucide-react'
import { sendVerificationCode, verifyAndRegister } from '../actions/auth'

export default function RegisterPage() {
    const router = useRouter()
    const [step, setStep] = useState<'input' | 'verify'>('input')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Store credentials for step 2
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        code: ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleStep1Submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            setError('パスワードが一致しません')
            return
        }

        setLoading(true)
        setError('')

        const submitData = new FormData()
        submitData.append('email', formData.email)
        submitData.append('password', formData.password)

        try {
            const result = await sendVerificationCode(submitData)
            if (result.error) {
                setError(result.error)
            } else {
                setStep('verify')
            }
        } catch (err) {
            setError('エラーが発生しました')
        } finally {
            setLoading(false)
        }
    }

    const handleStep2Submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const submitData = new FormData()
        submitData.append('email', formData.email)
        submitData.append('password', formData.password)
        submitData.append('name', formData.name)
        submitData.append('code', formData.code)

        try {
            const result = await verifyAndRegister(submitData)
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

    const handleResend = async () => {
        setLoading(true)
        const submitData = new FormData()
        submitData.append('email', formData.email)
        submitData.append('password', formData.password)
        await sendVerificationCode(submitData)
        alert('認証コードを再送信しました')
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
            {/* Background gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 via-white to-blue-50 -z-10"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-200/40 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[100px]"></div>

            <div className="glass-panel w-full max-w-md p-8 rounded-2xl">
                <h1 className="text-3xl font-bold text-center mb-2 text-slate-800" key={step}>
                    {step === 'input' ? 'Create Account' : 'Verify Email'}
                </h1>
                <p className="text-center text-slate-500 mb-8">
                    {step === 'input' ? '無料でアカウントを作成' : `${formData.email} にコードを送信しました`}
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                {step === 'input' ? (
                    <form onSubmit={handleStep1Submit} className="space-y-6" key="step1-form">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 ml-1">お名前 (任意)</label>
                            <input
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="Taro Yamada"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 ml-1">メールアドレス</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 ml-1">パスワード</label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="••••••••"
                                minLength={6}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 ml-1">パスワード (確認)</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                        >
                            {loading ? '送信中...' : '次へ'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleStep2Submit} className="space-y-6" key="step2-form">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 ml-1">認証コード (6桁)</label>
                            <input
                                name="code"
                                type="text"
                                value={formData.code}
                                onChange={handleInputChange}
                                className="input-field text-center text-2xl tracking-[0.5em]"
                                placeholder="123456"
                                maxLength={6}
                                required
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                        >
                            {loading ? '確認中...' : '登録完了'}
                        </button>

                        <div className="flex justify-between mt-4">
                            <button
                                type="button"
                                onClick={() => setStep('input')}
                                className="text-sm text-slate-500 hover:text-slate-700"
                            >
                                ← 戻る
                            </button>
                            <button
                                type="button"
                                onClick={handleResend}
                                className="text-sm text-primary hover:text-primary-hover"
                            >
                                コード再送信
                            </button>
                        </div>
                    </form>
                )}

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
