-- READ ONLY. Run in Supabase SQL Editor, not in the game client.
-- Returns field names and counts, never names, emails, account IDs or tokens.
-- No accounts are created, updated or deleted.
select
  metadata.key as metadata_field,
  count(*) as google_accounts_with_field
from auth.users as u
cross join lateral jsonb_object_keys(coalesce(u.raw_user_meta_data, '{}'::jsonb)) as metadata(key)
where exists (
  select 1 from auth.identities as i
  where i.user_id = u.id and i.provider = 'google'
)
group by metadata.key
order by metadata.key;
