'use client'
import { createClient } from '@/utils/supabase/client'
import styles from './request.module.css'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Database } from '@/types/supabase'

import { Suspense } from 'react'

function RequestForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const subjectIdParam = searchParams.get('subject_id')
    const supabase = createClient()

    const [subjectName, setSubjectName] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [title, setTitle] = useState('')

    useEffect(() => {
        const fetchSubject = async () => {
            if (subjectIdParam) {
                const { data } = await supabase.from('subjects').select('name').eq('id', subjectIdParam).single() as { data: any, error: any }
                if (data) setSubjectName(data.name)
            }
        }
        fetchSubject()
    }, [subjectIdParam, supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            alert('You must be logged in to make a request.')
            router.push('/login')
            return
        }

        const { error } = await supabase.from('requests').insert({
            subject_id: subjectIdParam!,
            requester_id: user.id,
            title: title,
            status: 'OPEN',
            subscriber_count: 1
        } as any)

        if (error) {
            console.error('Error creating request:', error)
            alert('Failed to create request: ' + error.message)
            setSubmitting(false)
        } else {
            alert('Request created successfully!')
            router.push(`/subject/${subjectIdParam}`)
        }
    }

    if (!subjectIdParam) {
        return <div className={styles.container}>Error: No subject specified.</div>
    }

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <h1 className={`${styles.title} reveal-up`}>Material Inquiry</h1>
                <p className={`${styles.helpText} reveal-up`} style={{ transitionDelay: '0.1s' }}>
                    Requesting documents for: <span style={{ color: 'var(--foreground)', opacity: 1, fontWeight: 'bold' }}>{subjectName || 'ARCHIVE INDEXING...'}</span>
                </p>

                <form onSubmit={handleSubmit} className="reveal-up" style={{ transitionDelay: '0.2s' }}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="title">Document Specification</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className={styles.input}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. SEMESTER VII: RESEARCH PAPERS 2024"
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '4rem' }}>
                        <button type="submit" className={styles.submitButton} disabled={submitting}>
                            {submitting ? 'Transmitting Inqury...' : 'Submit Inquiry'}
                        </button>
                        <Link href={`/subject/${subjectIdParam}`} className={styles.cancelLink}>Abort</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function CreateRequestPage() {
    return (
        <Suspense fallback={<div className={styles.container}>Loading Inquiry...</div>}>
            <RequestForm />
        </Suspense>
    )
}
