-- F09: reject incomplete input and prevent a replay from resetting an active client.
CREATE OR REPLACE FUNCTION public.dcc_submit_initial_questionnaire(p_weight numeric, p_age integer, p_height_cm numeric, p_goal text, p_foods_to_avoid text DEFAULT ''::text, p_current_injury boolean DEFAULT false, p_injury_details text DEFAULT ''::text, p_previous_surgery boolean DEFAULT false, p_surgery_details text DEFAULT ''::text, p_food_allergy boolean DEFAULT false, p_food_allergy_details text DEFAULT ''::text, p_trained_before boolean DEFAULT false, p_training_experience text DEFAULT ''::text, p_preferred_training_days integer DEFAULT 3, p_wants_photo_checkin boolean DEFAULT false, p_sex text DEFAULT NULL::text, p_requested_plan text DEFAULT NULL::text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare v_uid uuid:=auth.uid(); v_client public.clients%rowtype;
begin
 if v_uid is null then raise exception 'Authentication required' using errcode='42501'; end if;
 select * into v_client from public.clients where auth_user_id=v_uid limit 1 for update;
 if v_client.id is null then raise exception 'Linked client not found' using errcode='42501'; end if;
 if v_client.status is distinct from 'Pendiente de cuestionario' or v_client.active_plan is not null then
   raise exception 'Initial questionnaire already completed' using errcode='42501';
 end if;
 if p_weight is null or p_weight<=0 or p_weight>=500 or p_age is null or p_age<14 or p_age>100 or p_height_cm is null or p_height_cm<120 or p_height_cm>230 or nullif(trim(p_goal),'') is null or p_preferred_training_days is null or p_preferred_training_days<2 or p_preferred_training_days>7 or p_sex is null or p_sex not in ('male','female') or p_requested_plan is null or p_requested_plan not in ('nutrition','training','complete') then raise exception 'Invalid questionnaire data' using errcode='22023'; end if;
 if p_current_injury and nullif(trim(p_injury_details),'') is null then raise exception 'Injury details required' using errcode='22023'; end if;
 if p_previous_surgery and nullif(trim(p_surgery_details),'') is null then raise exception 'Surgery details required' using errcode='22023'; end if;
 if p_food_allergy and nullif(trim(p_food_allergy_details),'') is null then raise exception 'Allergy details required' using errcode='22023'; end if;
 update public.clients set weight=p_weight,initial_weight=coalesce(initial_weight,p_weight),age=p_age,height_cm=p_height_cm,goal=trim(p_goal),foods_to_avoid=coalesce(trim(p_foods_to_avoid),''),
 current_injury=p_current_injury,injury_details=case when p_current_injury then nullif(trim(p_injury_details),'') else null end,
 previous_surgery=p_previous_surgery,surgery_details=case when p_previous_surgery then nullif(trim(p_surgery_details),'') else null end,
 food_allergy=p_food_allergy,food_allergy_details=case when p_food_allergy then nullif(trim(p_food_allergy_details),'') else null end,
 trained_before=p_trained_before,training_experience=case when p_trained_before then nullif(trim(p_training_experience),'') else null end,
 preferred_training_days=p_preferred_training_days,wants_photo_checkin=p_wants_photo_checkin,sex=p_sex,
 requested_plan=p_requested_plan,plan=case p_requested_plan when 'nutrition' then 'DCC Nutrición' when 'training' then 'DCC Entrenamiento' else 'DCC Complete' end,
 status='Pendiente'
 where id=v_client.id;
 insert into public.client_weights(client_id,weight,recorded_at) select v_client.id,p_weight,now()
 where not exists(select 1 from public.client_weights where client_id=v_client.id);
 return true;
end $function$;
