import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/proxy'

export async function proxy(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match only protected routes and auth routes.
         * Excludes landing page ('/') and static assets for performance.
         */
        '/dashboard/:path*',
        '/profile/:path*',
        '/upload/:path*',
        '/request/:path*',
        '/subject/:path*',
        '/course/:path*',
        '/search/:path*',
        '/login',
        '/auth/:path*',
    ],
}
