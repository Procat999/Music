// supabase.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zqgrdbmqlszjsrepnvcx.supabase.co";
const SUPABASE_KEY = "sb_publishable_DjE9ANlxRd1AmDshacLfrw_VjV-_y7f";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
