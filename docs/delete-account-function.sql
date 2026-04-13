-- ============================================================================
-- O-Match: Self-service account deletion function for authenticated users
-- 用途：配合前端“注销账号”按钮，通过 RPC delete_my_account 删除当前用户
-- 执行位置：Supabase Dashboard -> SQL Editor
-- ============================================================================

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  uid uuid;
begin
  uid := auth.uid();

  if uid is null then
    raise exception 'Not authenticated';
  end if;

  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_my_account() from public;
grant execute on function public.delete_my_account() to authenticated;
