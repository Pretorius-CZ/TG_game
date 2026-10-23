import {createClient} from '@supabase/supabase-js';
import {isPlaytestURL} from './playtestMode.js';
import {android} from './platform.js';
const playtest=typeof location!=='undefined'&&isPlaytestURL(location.href);

// Public browser credentials. Access to saves is restricted by database RLS.
export const supabaseUrl=import.meta.env.VITE_SUPABASE_URL || 'https://pogyrdsuoqpnzsdeuqpk.supabase.co';
export const supabase = createClient(
  supabaseUrl,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_OcpDo2PUUgv7JBsrE-DXtw_mJCiBbvg',
  {auth: {flowType: 'pkce', detectSessionInUrl: !playtest&&!android, persistSession: !playtest,autoRefreshToken:!playtest}}
);
