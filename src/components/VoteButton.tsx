'use client'

import { useState } from 'react'
import { vote } from '@/actions/vote'
import styles from './VoteButton.module.css'

interface Props {
    materialId: string
    uploaderId: string
    initialUpvotes: number
    initialDownvotes: number
    initialUserVote?: number // 1, -1, or null/undefined
}

export default function VoteButton({ materialId, uploaderId, initialUpvotes, initialDownvotes, initialUserVote }: Props) {
    const [upvotes, setUpvotes] = useState(initialUpvotes)
    const [downvotes, setDownvotes] = useState(initialDownvotes)
    const [userVote, setUserVote] = useState(initialUserVote || 0)
    const [loading, setLoading] = useState(false)

    const handleVote = async (value: number) => {
        if (loading) return
        setLoading(true)

        const previousUserVote = userVote
        const previousUpvotes = upvotes
        const previousDownvotes = downvotes

        let newUpvotes = upvotes
        let newDownvotes = downvotes
        let newUserVote = userVote

        if (userVote === value) {
            newUserVote = 0
            if (value === 1) newUpvotes--;
            else newDownvotes--;
        } else {
            newUserVote = value
            if (value === 1) {
                newUpvotes++
                if (previousUserVote === -1) newDownvotes--;
            } else {
                newDownvotes++
                if (previousUserVote === 1) newUpvotes--;
            }
        }

        setUserVote(newUserVote)
        setUpvotes(newUpvotes)
        setDownvotes(newDownvotes)

        try {
            await vote(materialId, value, uploaderId)
        } catch (error) {
            console.error(error)
            setUserVote(previousUserVote)
            setUpvotes(previousUpvotes)
            setDownvotes(previousDownvotes)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.voteContainer}>
            <button
                onClick={(e) => { e.preventDefault(); handleVote(1); }}
                className={`${styles.voteButton} ${userVote === 1 ? styles.voteButtonActiveUp : ''}`}
                disabled={loading}
                title="Upvote"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
            </button>
            <span className={styles.voteCount}>
                {upvotes - downvotes}
            </span>
            <button
                onClick={(e) => { e.preventDefault(); handleVote(-1); }}
                className={`${styles.voteButton} ${userVote === -1 ? styles.voteButtonActiveDown : ''}`}
                disabled={loading}
                title="Downvote"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
        </div>
    )
}
