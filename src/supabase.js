import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tcfmkeoxgineniotjgze.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjZm1rZW94Z2luZW5pb3RqZ3plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNDMxOTIsImV4cCI6MjA4MTcxOTE5Mn0.ydxPgEWihDJ16NtXjtxEJwRAE-HiGW_T5buBN8ov9Io'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)