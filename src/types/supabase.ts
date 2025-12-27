export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            universities: {
                Row: {
                    id: string
                    name: string
                    code: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    code: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    code?: string
                    created_at?: string
                }
            }
            courses: {
                Row: {
                    id: string
                    university_id: string
                    name: string
                    code: string
                    total_semesters: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    university_id: string
                    name: string
                    code: string
                    total_semesters?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    university_id?: string
                    name?: string
                    code?: string
                    total_semesters?: number
                    created_at?: string
                }
            }
            subjects: {
                Row: {
                    id: string
                    course_id: string
                    name: string
                    code: string
                    semester: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    course_id: string
                    name: string
                    code: string
                    semester: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    course_id?: string
                    name?: string
                    code?: string
                    semester?: number
                    created_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    username: string | null
                    reputation: number
                    university_id: string | null
                    avatar_url: string | null
                }
                Insert: {
                    id: string
                    username?: string | null
                    reputation?: number
                    university_id?: string | null
                    avatar_url?: string | null
                }
                Update: {
                    id?: string
                    username?: string | null
                    reputation?: number
                    university_id?: string | null
                    avatar_url?: string | null
                }
            }
            materials: {
                Row: {
                    id: string
                    subject_id: string
                    uploader_id: string
                    title: string
                    description: string | null
                    content_url: string | null
                    resource_type: string // USER-DEFINED in SQL, treating as string for now
                    year: number
                    professor: string | null
                    is_anonymous: boolean
                    status: string
                    upvotes: number
                    downvotes: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    subject_id: string
                    uploader_id: string
                    title: string
                    description?: string | null
                    content_url?: string | null
                    resource_type: string
                    year: number
                    professor?: string | null
                    is_anonymous?: boolean
                    status?: string
                    upvotes?: number
                    downvotes?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    subject_id?: string
                    uploader_id?: string
                    title?: string
                    description?: string | null
                    content_url?: string | null
                    resource_type?: string
                    year?: number
                    professor?: string | null
                    is_anonymous?: boolean
                    status?: string
                    upvotes?: number
                    downvotes?: number
                    created_at?: string
                }
            }
            requests: {
                Row: {
                    id: string
                    subject_id: string
                    requester_id: string
                    title: string
                    status: string
                    subscriber_count: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    subject_id: string
                    requester_id: string
                    title: string
                    status?: string
                    subscriber_count?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    subject_id?: string
                    requester_id?: string
                    title?: string
                    status?: string
                    subscriber_count?: number
                    created_at?: string
                }
            }
            request_subscriptions: {
                Row: {
                    id: string
                    request_id: string
                    user_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    request_id: string
                    user_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    request_id?: string
                    user_id?: string
                    created_at?: string
                }
            }
            votes: {
                Row: {
                    id: string
                    user_id: string
                    material_id: string
                    value: number
                }
                Insert: {
                    id?: string
                    user_id: string
                    material_id: string
                    value: number
                }
                Update: {
                    id?: string
                    user_id?: string
                    material_id?: string
                    value?: number
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            process_vote: {
                Args: {
                    vote_value: number
                    vote_material_id: string
                    vote_uploader_id: string
                }
                Returns: void
            }
        }
        Enums: {
            [_ in never]: never
        }
    }
}
