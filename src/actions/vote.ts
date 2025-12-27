'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function vote(
    materialId: string,
    value: number, // 1 for upvote, -1 for downvote
    uploaderId: string
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // @ts-ignore - Typescript is having trouble inferring the args despite correct Database definitions
    const { error } = await supabase.rpc('process_vote', {
        vote_value: value,
        vote_material_id: materialId,
        vote_uploader_id: uploaderId
    })

    if (error) {
        console.error('Error processing vote:', error)
        throw new Error('Failed to vote: ' + error.message)
    }

    revalidatePath(`/subject/[id]`) // Best effort revalidation
}
