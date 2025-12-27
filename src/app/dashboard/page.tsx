import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import styles from './dashboard.module.css'
import SearchBar from '@/components/SearchBar'
import Link from 'next/link'
import { Database } from '@/types/supabase'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profileResponse, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

    if (profileError) console.error('Error fetching profile:', profileError)

    let profile = profileResponse

    if (!profile) {
        const { data: newProfile, error: createError } = await (supabase
            .from('profiles') as any)
            .insert({
                id: user.id,
                username: user.email?.split('@')[0] || 'Unknown Student',
                reputation: 0
            })
            .select()
            .maybeSingle()

        if (createError) console.error('Error creating profile:', createError)
        else if (newProfile) profile = newProfile
    }

    const displayName = (profile as any)?.username || user.email?.split('@')[0] || 'Unknown Student'
    const displayRep = (profile as any)?.reputation ?? 0

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/" className={styles.title}>Study.io</Link>
                <div className={styles.headerActions}>
                    <SearchBar />
                    <Link href="/profile" className="mono" style={{ textDecoration: 'underline' }}>Profile</Link>
                    <div className={styles.userInfo}>
                        <span className={styles.username}>{displayName}</span>
                        <span className={styles.reputation}>REP: {displayRep}</span>
                    </div>
                    <form action="/auth/signout" method="post">
                        <button className={styles.signOutButton}>
                            Sign Out
                        </button>
                    </form>
                </div>
            </header>

            <main className={styles.main}>
                <div className="reveal-up">
                    <h2 className={styles.welcomeHeading}>The Commons is yours.</h2>
                    <p className={styles.subtext}>A gateway to student-verified knowledge. Explore universities, courses, and shared archives.</p>
                </div>

                <div className={styles.grid}>
                    <div className={`${styles.card} reveal-up`}>
                        <div className="mono" style={{ opacity: 0.5 }}>Personal</div>
                        <h3 className={styles.cardTitle}>My Archives</h3>
                    </div>
                    <div className={`${styles.card} reveal-up`}>
                        <div className="mono" style={{ opacity: 0.5 }}>Community</div>
                        <h3 className={styles.cardTitle}>Recent Uploads</h3>
                    </div>
                </div>

                <div className={styles.universitiesSection}>
                    <h2 className={`${styles.sectionTitle} reveal-up`}>University Directory</h2>
                    <UniversityList universityId={(profile as any)?.university_id} />
                </div>
            </main>
        </div>
    )
}

async function UniversityList({ universityId }: { universityId: string | null | undefined }) {
    const supabase = await createClient()

    let query = supabase
        .from('universities')
        .select(`
            *,
            courses (*)
        `)

    if (universityId) {
        query = query.eq('id', universityId)
    }

    const { data: universities } = await query

    if (!universities?.length) {
        return <p className="mono" style={{ opacity: 0.5 }}>No universities found.</p>
    }

    type UniversityWithCourses = Database['public']['Tables']['universities']['Row'] & {
        courses: Database['public']['Tables']['courses']['Row'][]
    }

    const typedUniversities = universities as unknown as UniversityWithCourses[]

    return (
        <div className={styles.universityGrid}>
            {typedUniversities.map((uni, idx) => (
                <div key={uni.id} className={`${styles.uniCard} reveal-up`}>
                    <h3 className={styles.uniName}>{uni.name} ({uni.code})</h3>
                    <div className={styles.courseList}>
                        {uni.courses && Array.isArray(uni.courses) && uni.courses.map((course) => (
                            <CourseItem key={course.id} course={course} />
                        ))}
                    </div>
                    {universityId && (
                        <p className="mono" style={{ marginTop: '2rem', opacity: 0.3, fontSize: '0.6rem' }}>
                            Your University. <Link href="/profile" style={{ textDecoration: 'underline' }}>Update</Link>
                        </p>
                    )}
                </div>
            ))}
        </div>
    )
}

function CourseItem({ course }: { course: Database['public']['Tables']['courses']['Row'] }) {
    return (
        <div className={styles.courseItem}>
            <h4>{course.name}</h4>
            <p>{course.code} ● {course.total_semesters} Semesters</p>
            <Link href={`/course/${course.id}`} className={styles.link}>
                View Subjects →
            </Link>
        </div>
    )
}
