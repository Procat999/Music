// js/supabase.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/supabase.js";

export const supabaseUrl = "https://zqgrdbmqlszjsrepnvcx.supabase.co";
export const supabaseKey = "sb_publishable_DjE9ANlxRd1AmDshacLfrw_VjV-_y7f";

export const supabase = createClient(supabaseUrl, supabaseKey);
