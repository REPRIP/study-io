import styles from './RequestCard.module.css'
import { Database } from '@/types/supabase'

interface Props {
    request: Database['public']['Tables']['requests']['Row']
}

export default function RequestCard({ request }: Props) {
    return (
        <div className={styles.requestCard}>
            <h4 className={styles.requestTitle}>{request.title}</h4>
            <div className={styles.requestMeta}>
                <span>{request.subscriber_count} Students waiting</span>
                <span>{request.status}</span>
            </div>
        </div>
    )
}
