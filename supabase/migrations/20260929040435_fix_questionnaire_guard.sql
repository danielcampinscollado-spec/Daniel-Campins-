-- F02: align the existing onboarding guard with the live questionnaire RPC.
-- Tested in the isolated project only. No table/data changes.
CREATE OR REPLACE FUNCTION public.dcc_guard_client_self_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare v_email text := lower(btrim(coalesce(auth.jwt()->>'email','')));
begin
 if auth.uid() is null then return new; end if;
 if public.dcc_is_coach() then return new; end if;
 if old.auth_user_id is null and new.auth_user_id=auth.uid() and v_email<>'' and lower(btrim(coalesce(old.access_email,'')))=v_email then
   if (to_jsonb(new)-array['auth_user_id']) is distinct from (to_jsonb(old)-array['auth_user_id']) then raise exception 'initial client claim may only set auth ownership' using errcode='42501'; end if;
   return new;
 end if;
 if old.auth_user_id is distinct from auth.uid() then raise exception 'client ownership required' using errcode='42501'; end if;
 -- The initial questionnaire now writes sex and the requested plan. Keep these
 -- fields read-only after onboarding, and never allow active_plan/ownership here.
 if row(new.sex,new.requested_plan,new.plan) is distinct from row(old.sex,old.requested_plan,old.plan)
    and (old.status is distinct from 'Pendiente de cuestionario' or old.active_plan is not null) then
   raise exception 'initial questionnaire fields are locked' using errcode='42501';
 end if;
 if (to_jsonb(new)-array[
   'weight','initial_weight','status','password_setup_completed','age','height_cm','goal','foods_to_avoid',
   'current_injury','injury_details','previous_surgery','surgery_details',
   'food_allergy','food_allergy_details','trained_before','training_experience',
   'preferred_training_days','wants_photo_checkin','sex','requested_plan','plan'
 ]) is distinct from
 (to_jsonb(old)-array[
   'weight','initial_weight','status','password_setup_completed','age','height_cm','goal','foods_to_avoid',
   'current_injury','injury_details','previous_surgery','surgery_details',
   'food_allergy','food_allergy_details','trained_before','training_experience',
   'preferred_training_days','wants_photo_checkin','sex','requested_plan','plan'
 ]) then
   raise exception 'client may only update own onboarding state' using errcode='42501';
 end if;
 if new.status is distinct from old.status and new.status<>'Pendiente' then raise exception 'client may only mark own status pending' using errcode='42501'; end if;
 if old.password_setup_completed=true and new.password_setup_completed=false then raise exception 'password setup cannot be reverted by client' using errcode='42501'; end if;
 return new;
end $function$;
