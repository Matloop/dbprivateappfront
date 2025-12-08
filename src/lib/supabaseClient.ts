import { createClient } from "@supabase/supabase-js"

const supabaseUrl = 'https://zplgyjoakzxehysmerds.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbGd5am9ha3p4ZWh5c21lcmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjQwMjcsImV4cCI6MjA3OTc0MDAyN30.T-TpYa2Qu_DmXsldKAIQ2twRJXeKCOxwhCuJml6oKW8'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)