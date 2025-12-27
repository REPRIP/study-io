'use client'
import { createClient } from '@/utils/supabase/client'
import styles from './upload.module.css'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Database } from '@/types/supabase'

export default function UploadPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const subjectIdParam = searchParams.get('subject_id')
    const supabase = createClient()

    const [subjects, setSubjects] = useState<Database['public']['Tables']['subjects']['Row'][]>([])
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        subject_id: subjectIdParam || '',
        title: '',
        description: '',
        resource_type: 'NOTES',
        year: new Date().getFullYear(),
        professor: '',
        content_url: '',
        is_anonymous: false
    })

    useEffect(() => {
        const fetchSubjects = async () => {
            const { data } = await supabase.from('subjects').select('*').order('name')
            if (data) setSubjects(data)
        }
        fetchSubjects()
    }, [supabase])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Additional handler for checkbox since it's different
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            alert('You must be logged in to upload.')
            router.push('/login')
            return
        }

        // Get user profile id (assuming it matches auth id based on schema constraints usually, 
        // but schema has `id` in profiles referencing `auth.users.id`, so user.id is the profile id).

        const { error } = await supabase.from('materials').insert({
            subject_id: formData.subject_id,
            uploader_id: user.id,
            title: formData.title,
            description: formData.description,
            content_url: formData.content_url,
            resource_type: formData.resource_type,
            year: Number(formData.year),
            professor: formData.professor,
            is_anonymous: formData.is_anonymous,
            status: 'ACTIVE'
        } as any)

        if (error) {
            console.error('Error uploading:', error)
            alert('Failed to upload material: ' + error.message)
            setSubmitting(false)
        } else {
            alert('Material uploaded successfully!')
            router.push(`/subject/${formData.subject_id}`)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <h1 className={`${styles.title} reveal-up`}>Archive Contribution</h1>

                <form onSubmit={handleSubmit} className="reveal-up" style={{ transitionDelay: '0.1s' }}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="subject_id">Subject Catalog</label>
                        <select
                            id="subject_id"
                            name="subject_id"
                            className={styles.select}
                            value={formData.subject_id}
                            onChange={(e) => handleChange(e as any)}
                            required
                        >
                            <option value="">Select an entry...</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="title">Document Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className={styles.input}
                            value={formData.title}
                            onChange={(e) => handleChange(e as any)}
                            placeholder="e.g. SEMESTER IV NOTES: QUANTUM MEC"
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                            <label className={styles.label} htmlFor="resource_type">Classification</label>
                            <select
                                id="resource_type"
                                name="resource_type"
                                className={styles.select}
                                value={formData.resource_type}
                                onChange={(e) => handleChange(e as any)}
                            >
                                <option value="NOTES">Notes</option>
                                <option value="QP">Exam Records</option>
                                <option value="BOOK">Academic Text</option>
                                <option value="OTHER">Miscellaneous</option>
                            </select>
                        </div>
                        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                            <label className={styles.label} htmlFor="year">Academic Period</label>
                            <input
                                type="number"
                                id="year"
                                name="year"
                                className={styles.input}
                                value={formData.year}
                                onChange={(e) => handleChange(e as any)}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="professor">Attributed Faculty (Optional)</label>
                        <input
                            type="text"
                            id="professor"
                            name="professor"
                            className={styles.input}
                            value={formData.professor}
                            onChange={(e) => handleChange(e as any)}
                            placeholder="NAME OF PROFESSOR"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="content_url">Archive Reference (URL)</label>
                        <input
                            type="url"
                            id="content_url"
                            name="content_url"
                            className={styles.input}
                            value={formData.content_url}
                            onChange={(e) => handleChange(e as any)}
                            placeholder="https://cloud-storage-link.com/file"
                            required
                        />
                        <p className={styles.helpText}>
                            Provide a stable link to the hosted resource (Drive, Dropbox, etc).
                        </p>
                    </div>

                    <div className={styles.formGroup} style={{ marginTop: '2rem' }}>
                        <label className={styles.checkboxContainer}>
                            <input
                                type="checkbox"
                                name="is_anonymous"
                                checked={formData.is_anonymous}
                                onChange={(e) => handleCheckboxChange(e as any)}
                                className={styles.checkbox}
                            />
                            <span className={styles.label} style={{ margin: 0 }}>Anonymize Contribution</span>
                        </label>
                    </div>

                    <div className={styles.disabledFileSection}>
                        Direct File Injection (In Development)
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '4rem' }}>
                        <button type="submit" className={styles.submitButton} disabled={submitting}>
                            {submitting ? 'Transmitting...' : 'Commit to Archive'}
                        </button>
                        <Link href="/dashboard" className={styles.cancelLink}>Abort</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
