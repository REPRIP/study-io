'use client'
import { createClient } from '@/utils/supabase/client'
import styles from './profile.module.css'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/supabase'

export default function ProfilePage() {
    const supabase = createClient()
    const router = useRouter()

    // State
    const [profile, setProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null)
    const [universities, setUniversities] = useState<Database['public']['Tables']['universities']['Row'][]>([])
    const [myUploads, setMyUploads] = useState<Database['public']['Tables']['materials']['Row'][]>([])
    const [myRequests, setMyRequests] = useState<any[]>([]) // Using any for joined data simplification
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'uploads' | 'requests'>('uploads')

    // University Update State
    const [selectedUni, setSelectedUni] = useState('')
    const [updatingUni, setUpdatingUni] = useState(false)

    useEffect(() => {
        const fetchProfileData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            // Fetch Profile
            let { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle()

            if (profileError) {
                console.error('Error fetching profile:', profileError)
            }

            if (!profileData) {
                // Profile not found, create one
                const { data: newProfile, error: createError } = await (supabase
                    .from('profiles') as any)
                    .insert({
                        id: user.id,
                        username: user.email?.split('@')[0] || 'Unknown Student',
                        reputation: 0
                    })
                    .select()
                    .maybeSingle()

                if (createError) {
                    console.error('Error creating profile:', createError)
                } else if (newProfile) {
                    profileData = newProfile
                }
            }

            if (profileData) {
                setProfile(profileData)
                setSelectedUni((profileData as any).university_id || '')
            }

            // Fetch Universities for Checkbox
            const { data: uniData } = await supabase.from('universities').select('*')
            if (uniData) setUniversities(uniData)

            // Fetch My Uploads
            const { data: uploads } = await supabase
                .from('materials')
                .select('*')
                .eq('uploader_id', user.id)
                .order('created_at', { ascending: false })
            if (uploads) setMyUploads(uploads)

            // Fetch My Requests
            const { data: requests } = await supabase
                .from('requests')
                .select('*')
                .eq('requester_id', user.id)
                .order('created_at', { ascending: false })
            if (requests) setMyRequests(requests)

            setLoading(false)
        }
        fetchProfileData()
    }, [supabase, router])

    const handleUpdateUniversity = async () => {
        setUpdatingUni(true)

        const { error } = await (supabase.from('profiles') as any)
            .update({ university_id: selectedUni || null })
            .eq('id', (profile as any)?.id!)

        if (error) {
            alert('Error updating university: ' + error.message)
        } else {
            alert('University records synchronized!')
            router.refresh()
        }
        setUpdatingUni(false)
    }

    if (loading) return (
        <div className={styles.container}>
            <div className="mono reveal-up" style={{ opacity: 0.5 }}>Synchronizing Archive Records...</div>
        </div>
    )

    // Fallback username for display
    const usernameDisplay = profile?.username || (typeof window !== 'undefined' ? localStorage.getItem('last_user_email')?.split('@')[0] : '') || 'Unknown Student'

    return (
        <div className={styles.container}>
            <Link href="/dashboard" className={styles.backLink}>← Back to Commons</Link>

            <header className={styles.header}>
                <h1 className={`${styles.title} reveal-up`}>My Archive</h1>

                <div className={`${styles.profileSummary} reveal-up`} style={{ transitionDelay: '0.1s' }}>
                    <div className={styles.reputationBadge}>
                        Reputation: {profile?.reputation ?? 0}
                    </div>
                    <div className={styles.usernameLabel}>Identification</div>
                    <div className={styles.username}>{usernameDisplay}</div>

                    <div className={styles.universitySection}>
                        <label>Institutional Enrollment</label>
                        <div className={styles.formGroup}>
                            <select
                                className={styles.select}
                                value={selectedUni}
                                onChange={(e) => setSelectedUni(e.target.value)}
                            >
                                <option value="">-- No University Selected --</option>
                                {universities.map(uni => (
                                    <option key={uni.id} value={uni.id}>{uni.name}</option>
                                ))}
                            </select>
                            <button
                                className={styles.button}
                                onClick={handleUpdateUniversity}
                                disabled={updatingUni}
                            >
                                {updatingUni ? 'Syncing...' : 'Update Records'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className={`${styles.tabs} reveal-up`} style={{ transitionDelay: '0.2s' }}>
                <div
                    className={`${styles.tab} ${activeTab === 'uploads' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('uploads')}
                >
                    Contributions
                </div>
                <div
                    className={`${styles.tab} ${activeTab === 'requests' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('requests')}
                >
                    Inquiries
                </div>
            </div>

            <div className={`${styles.content} reveal-up`} style={{ transitionDelay: '0.3s' }}>
                {activeTab === 'uploads' && (
                    <div className={styles.list}>
                        {myUploads.map(upload => (
                            <div key={upload.id} className={styles.itemCard}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div className="mono" style={{ opacity: 0.4, fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                            {upload.resource_type} • {new Date(upload.created_at).toLocaleDateString()}
                                        </div>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                                            <Link href={upload.content_url || '#'} style={{ color: 'inherit', textDecoration: 'none' }}>{upload.title}</Link>
                                        </h3>
                                        <div className="mono" style={{ opacity: 0.6, fontSize: '0.8rem' }}>
                                            {upload.upvotes} UPVOTES • {upload.downvotes} DOWNVOTES
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {myUploads.length === 0 && <p className={styles.noData}>Access Denied: No contributions found.</p>}
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className={styles.list}>
                        {myRequests.map(req => (
                            <div key={req.id} className={styles.itemCard}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div className="mono" style={{ opacity: 0.4, fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                            STATUS: {req.status} • {new Date(req.created_at).toLocaleDateString()}
                                        </div>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                                            {req.title}
                                        </h3>
                                        <div className="mono" style={{ opacity: 0.6, fontSize: '0.8rem' }}>
                                            {req.subscriber_count} STUDENTS WAITING
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {myRequests.length === 0 && <p className={styles.noData}>No pending inquiries recorded.</p>}
                    </div>
                )}
            </div>
        </div>
    )
}
