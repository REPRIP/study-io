import { createClient } from '@/utils/supabase/server'
import { unstable_cache } from 'next/cache' // Keep if needed or remove if unused locally
import { getSubjectPublicData } from '@/actions/subjects'
import styles from './subject.module.css'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import MaterialCard from '@/components/MaterialCard'
import RequestCard from '@/components/RequestCard'

interface Props {
    params: Promise<{ id: string }>
}

export default async function SubjectPage({ params }: Props) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch subject details
    // Fetch subject details
    // Caching Strategy:
    // 1. Fetch Public Data (Subject, Materials, Requests) from Cache (Shared across users)
    // 2. Fetch User Data (Session, Votes) Live (Per user)

    const [
        [
            { data: subjectData, error: subjectError },
            { data: materialsData },
            { data: requestsData }
        ],
        { data: { user } }
    ] = await Promise.all([
        getSubjectPublicData(id),
        supabase.auth.getUser()
    ])

    const subject = subjectData as any

    if (subjectError || !subject) {
        notFound()
    }

    const materials = materialsData as any[]
    const requests = requestsData as any[]

    // Fetch User Votes for these materials
    let userVotesMap: Record<string, number> = {}

    if (user && materials && materials.length > 0) {
        const materialIds = materials.map(m => m.id)
        const { data: votesData } = await supabase
            .from('votes')
            .select('material_id, value')
            .eq('user_id', user.id)
            .in('material_id', materialIds)

        const votes = votesData as any[]

        if (votes) {
            votes.forEach(v => {
                userVotesMap[v.material_id] = v.value
            })
        }
    }

    // For breadcrumb logic (simplified)
    // accessing the joined course/university which might need casting if TS complains, 
    // but in component rendering we can just optional chain.
    const course = (subject as any).courses
    // const university = course?.universities

    return (
        <div className={styles.container}>
            <Link href={course ? `/course/${course.id}` : '/dashboard'} className={styles.backLink}>
                ← Back to {course ? course.name : 'Commons'}
            </Link>

            <header className={styles.header}>
                <h1 className={`${styles.title} reveal-up`}>{subject.name}</h1>
                <p className={`${styles.subtitle} reveal-up`} style={{ transitionDelay: '0.1s' }}>
                    Reference: {subject.code} ● Structure: Semester {subject.semester}
                </p>
            </header>

            <div className={styles.contentRow}>
                {/* Materials Column */}
                <section className="reveal-up" style={{ transitionDelay: '0.2s' }}>
                    <h2 className={styles.columnTitle}>Study Materials</h2>
                    <div className={styles.materialList}>
                        {materials?.map((mat) => (
                            <MaterialCard key={mat.id} material={mat} userVote={userVotesMap[mat.id] || 0} />
                        ))}
                        {(!materials || materials.length === 0) && (
                            <p className="mono" style={{ opacity: 0.3 }}>No material entries recorded for this subject.</p>
                        )}

                        <div style={{ marginTop: '4rem' }}>
                            <Link
                                href={`/upload?subject_id=${subject.id}`}
                                className={styles.viewButton}
                                style={{ background: 'var(--accent)', color: 'var(--background)' }}
                            >
                                + Contribute Material
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Requests Column */}
                <section className="reveal-up" style={{ transitionDelay: '0.3s' }}>
                    <h2 className={styles.columnTitle}>Inquiries</h2>
                    <div className={styles.requestList}>
                        {requests?.map((req) => (
                            <RequestCard key={req.id} request={req} />
                        ))}
                        {(!requests || requests.length === 0) && (
                            <p className="mono" style={{ opacity: 0.3 }}>No active inquiries found.</p>
                        )}

                        <div style={{ marginTop: '4rem' }}>
                            <Link
                                href={`/request/create?subject_id=${subject.id}`}
                                className={styles.viewButton}
                                style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                            >
                                + Request Material
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
