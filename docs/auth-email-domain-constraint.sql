-- ============================================================================
-- O-Match Supabase Auth Email Domain Constraint
-- 作用：在后端强制仅允许 @hrbeu.edu.cn 邮箱注册
-- 执行位置：Supabase Dashboard -> SQL Editor
-- ============================================================================

CREATE OR REPLACE FUNCTION public.enforce_hrbeu_email_domain()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NEW.email IS NULL OR lower(NEW.email) !~ '^[a-z0-9._%+-]+@hrbeu\.edu\.cn$' THEN
    RAISE EXCEPTION 'Only @hrbeu.edu.cn email addresses are allowed';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_enforce_hrbeu_email_domain ON auth.users;

CREATE TRIGGER on_auth_user_enforce_hrbeu_email_domain
BEFORE INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.enforce_hrbeu_email_domain();

DROP TRIGGER IF EXISTS on_auth_user_enforce_hrbeu_email_domain_update ON auth.users;

CREATE TRIGGER on_auth_user_enforce_hrbeu_email_domain_update
BEFORE UPDATE OF email ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.enforce_hrbeu_email_domain();
