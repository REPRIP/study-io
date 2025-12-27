import styles from './MaterialCard.module.css'
import VoteButton from '@/components/VoteButton'
import { Database } from '@/types/supabase'

interface Props {
    material: Database['public']['Tables']['materials']['Row']
    userVote: number
}

export default function MaterialCard({ material, userVote }: Props) {
    return (
        <div className={styles.materialCard}>
            <div className={styles.materialContent}>
                <span className={styles.materialType}>{material.resource_type}</span>
                <h3 className={styles.materialTitle}>{material.title}</h3>
                <div className={styles.materialMeta}>
                    {material.year} • {material.professor || 'Unknown Professor'}
                </div>
                <a href={material.content_url || '#'} target="_blank" rel="noopener noreferrer" className={styles.viewButton}>
                    Open Resource
                </a>
            </div>

            <VoteButton
                materialId={material.id}
                uploaderId={material.uploader_id}
                initialUpvotes={material.upvotes || 0}
                initialDownvotes={material.downvotes || 0}
                initialUserVote={userVote}
            />
        </div>
    )
}
