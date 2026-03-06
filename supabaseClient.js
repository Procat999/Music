// supabaseClient.js
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://zqgrdbmqlszjsrepnvcx.supabase.co"
const supabaseKey = "sb_publishable_DjE9ANlxRd1AmDshacLfrw_VjV-_y7f"

export const supabase = createClient(supabaseUrl, supabaseKey)
