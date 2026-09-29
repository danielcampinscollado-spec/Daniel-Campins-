CREATE OR REPLACE FUNCTION public.dcc_set_client_plan(p_client_id text, p_plan text, p_activate boolean DEFAULT true)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
begin
 if not public.dcc_coach_owns_client(p_client_id) then raise exception 'forbidden' using errcode='42501'; end if;
 if p_plan is null or p_plan not in ('nutrition','training','complete') then raise exception 'invalid plan' using errcode='22023'; end if;
 update public.clients set
 requested_plan=coalesce(requested_plan,p_plan),
 active_plan=case when p_activate then p_plan else active_plan end,
 plan=case p_plan when 'nutrition' then 'DCC Nutrición' when 'training' then 'DCC Entrenamiento' else 'DCC Complete' end,
 status=case when p_activate then 'Activo' else status end
 where id=p_client_id;
 return found;
end $function$;
