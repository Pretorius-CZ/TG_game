import {createClient} from '@supabase/supabase-js';
import {isPlaytestURL} from './playtestMode.js';
const playtest=typeof location!=='undefined'&&isPlaytestURL(location.href);

// Public browser credentials. Access to saves is restricted by database RLS.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://pogyrdsuoqpnzsdeuqpk.supabase.co',
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_OcpDo2PUUgv7JBsrE-DXtw_mJCiBbvg',
  {auth: {flowType: 'pkce', detectSessionInUrl: !playtest, persistSession: !playtest,autoRefreshToken:!playtest}}
);
