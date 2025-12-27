import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import styles from './search.module.css'
import MaterialCard from '@/components/MaterialCard'

interface Props {
    searchParams: Promise<{ q: string }>
}

export default async function SearchPage({ searchParams }: Props) {
    const { q } = await searchParams
    const supabase = await createClient()

    // 1. Search Subjects
    const { data: subjects } = await supabase
        .from('subjects')
        .select('*, courses(*, universities(*))')
        .ilike('name', `%${q}%`)
        .limit(10)

    // 2. Search Materials
    const { data: materials } = await supabase
        .from('materials')
        .select('*')
        .ilike('title', `%${q}%`)
        .eq('status', 'ACTIVE')
        .limit(10)

    // User Vote placeholder logic (Server component)
    // In a real app we'd fetch user votes here too. 
    // For now pass 0 as we don't have user session easily here without more complexity.

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/dashboard" className={styles.backLink}>← Back to Commons</Link>
                <h1 className={`${styles.title} reveal-up`}>Query: "{q}"</h1>
            </header>

            <div className={styles.section}>
                <h2 className={`${styles.sectionTitle} reveal-up`} style={{ transitionDelay: '0.1s' }}>Subject Entries</h2>
                <div className={styles.grid}>
                    {subjects?.map((sub: any, idx: number) => (
                        <Link
                            href={`/subject/${sub.id}`}
                            key={sub.id}
                            className={`${styles.card} reveal-up`}
                            style={{ transitionDelay: `${0.2 + idx * 0.05}s`, textDecoration: 'none' }}
                        >
                            <div className={styles.cardHeader}>
                                {sub.courses?.universities?.code} ● {sub.code}
                            </div>
                            <h3 className={styles.cardTitle}>{sub.name}</h3>
                            <div className={styles.cardFooter}>
                                Record: Semester {sub.semester}
                            </div>
                        </Link>
                    ))}
                    {(!subjects || subjects.length === 0) && (
                        <p className="mono reveal-up" style={{ opacity: 0.3, transitionDelay: '0.2s' }}>No subject entries matching your query.</p>
                    )}
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={`${styles.sectionTitle} reveal-up`} style={{ transitionDelay: '0.3s' }}>Material Records</h2>
                <div className={styles.list}>
                    {materials?.map((mat: any, idx: number) => (
                        <div
                            key={mat.id}
                            className="reveal-up"
                            style={{ transitionDelay: `${0.4 + idx * 0.05}s` }}
                        >
                            <MaterialCard material={mat} userVote={0} />
                        </div>
                    ))}
                    {(!materials || materials.length === 0) && (
                        <p className="mono reveal-up" style={{ opacity: 0.3, transitionDelay: '0.4s' }}>No material records matching your query.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
