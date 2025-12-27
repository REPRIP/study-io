import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'

export const getSubjectPublicData = unstable_cache(
    async (subjectId: string) => {
        // Create a stateless client for public data to ensure no user session leaks into cache
        const supabase = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        return Promise.all([
            supabase.from('subjects').select('*, courses(*, universities(*))').eq('id', subjectId).single(),
            supabase.from('materials').select('*').eq('subject_id', subjectId).eq('status', 'ACTIVE').order('upvotes', { ascending: false }).limit(50),
            supabase.from('requests').select('*').eq('subject_id', subjectId).eq('status', 'OPEN').order('subscriber_count', { ascending: false }).limit(50),
        ])
    },
    ['subject-public-data'], // Base Cache Key - nextjs appends arguments automatically? actually unstable_cache 2nd arg is "keys". We should probably include the ID in the key generator function or trust the args.
    // Wait, unstable_cache signature is (func, keys, options). The keys array is static parts. The function args are automatically part of the cache key in recent versions?
    // Let's be safe and make the key dynamic or rely on the fact that we need a key factory. 
    // Actually, widespread usage suggests passing the ID in the key array if the function is generic. 
    // BUT, here we are wrapping a function that takes `subjectId`. 
    // Let's use a dynamic key generator inside if needed, but unstable_cache wrappers usually take the same args. 
    // Good practice: ['subject-data', subjectId] is NOT valid for the second arg (it must be string[]).
    // The correct way in Next.js 14+ is that the arguments passed to the cached function are automatically serialized into the key.
    // So `['subject-public-data']` is sufficient as a namespace.
    { revalidate: 60 }
)
