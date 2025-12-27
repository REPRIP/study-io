'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './login.module.css'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            localStorage.setItem('last_user_email', email)
            router.push('/dashboard')
        }
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            setError(error.message)
        } else {
            alert('Check your email for the confirmation link!')
        }
        setLoading(false)
    }

    return (
        <div className={styles.container}>
            <div className={`${styles.loginCard}`}>
                <h1 className={styles.title}>LOG IN</h1>

                {error && <div className={styles.error}>{error}</div>}

                <form className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="scholar@university.edu"
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.actions}>
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className={styles.primaryButton}
                        >
                            {loading ? 'Processing...' : 'Enter the Commons'}
                        </button>

                        <button
                            onClick={handleSignUp}
                            disabled={loading}
                            className={styles.secondaryButton}
                        >
                            Join the Community
                        </button>
                    </div>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Link href="/" className="mono" style={{ fontSize: '0.65rem', opacity: 0.5 }}>
                        ← Back to Archive
                    </Link>
                </div>
            </div>
        </div>
    )
}
