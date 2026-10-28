import {createClient} from '@supabase/supabase-js';
import {isPlaytestURL} from './playtestMode.js';
import {android} from './platform.js';
import {onlineServicesAllowed} from './androidAudience.js';
const playtest=typeof location!=='undefined'&&isPlaytestURL(location.href);
const online=!android||onlineServicesAllowed('android');

// Public browser credentials. Access to saves is restricted by database RLS.
export const supabaseUrl=import.meta.env.VITE_SUPABASE_URL || 'https://pogyrdsuoqpnzsdeuqpk.supabase.co';
export const supabase = createClient(
  supabaseUrl,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_OcpDo2PUUgv7JBsrE-DXtw_mJCiBbvg',
  {auth: {flowType: 'pkce', detectSessionInUrl: !playtest&&!android, persistSession: !playtest&&online,autoRefreshToken:!playtest&&online}}
);
