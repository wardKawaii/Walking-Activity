import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ccpxbthhcyebmzuvlcir.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcHhidGhoY3llYm16dXZsY2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NjIxNzMsImV4cCI6MjA4MTUzODE3M30.VEdgj8BsiI1E4qNk-eMq_aUBHV05PZ_t4cpxAkcG1iQ'

export const supabase = createClient(supabaseUrl, supabaseKey)