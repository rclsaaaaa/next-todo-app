'use client'

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { LogOut } from "lucide-react"

export function Header() {
    const { data: session } = useSession()

    if (!session) return null

    return (
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between h-16 px-4">
                <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    NextTodo
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-600 hidden sm:block">
                        {session.user?.name || session.user?.email}
                    </span>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>
        </header>
    )
}
