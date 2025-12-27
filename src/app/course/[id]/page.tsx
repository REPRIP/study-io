import { createClient } from '@/utils/supabase/server'
import styles from './course.module.css'
import { Database } from '@/types/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
    params: Promise<{ id: string }>
}

export default async function CoursePage({ params }: Props) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch course details
    const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single() as { data: any, error: any }

    if (courseError || !course) {
        return notFound()
    }

    // Fetch subjects
    const { data: subjects } = await supabase
        .from('subjects')
        .select('*')
        .eq('course_id', id)
        .order('semester', { ascending: true })

    return (
        <div className={styles.container}>
            <Link href="/dashboard" className={styles.backLink}>
                ← Back to Commons
            </Link>

            <header className={styles.header}>
                <h1 className={`${styles.title} reveal-up`}>{course.name}</h1>
                <p className={`${styles.subtitle} reveal-up`} style={{ transitionDelay: '0.1s' }}>
                    Reference: {course.code} ● Structure: {course.total_semesters} Semesters
                </p>
            </header>

            <main>
                <div className={styles.subjectsGrid}>
                    {subjects?.map((subject: any, idx: number) => (
                        <Link
                            href={`/subject/${subject.id}`}
                            key={subject.id}
                            className={`${styles.subjectCard} reveal-up`}
                            style={{ transitionDelay: `${0.2 + idx * 0.05}s` }}
                        >
                            <span className={styles.subjectCode}>{subject.code}</span>
                            <h3 className={styles.subjectName}>{subject.name}</h3>
                            <span className={styles.semesterTag}>Record: Semester {subject.semester}</span>
                        </Link>
                    ))}
                    {(!subjects || subjects.length === 0) && (
                        <p className="mono reveal-up" style={{ opacity: 0.3 }}>No subject entries found in this archive.</p>
                    )}
                </div>
            </main>
        </div>
    )
}
