-- F11: permit only the existing RPC's due-date advancement; keep ownership and plans locked.
CREATE OR REPLACE FUNCTION public.dcc_guard_client_self_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
 v_email text := lower(btrim(coalesce(auth.jwt()->>'email','')));
 v_today date := timezone('Europe/Madrid', now())::date;
 v_expected_date date;
begin
 if auth.uid() is null then return new; end if;
 if public.dcc_is_coach() then return new; end if;
 if old.auth_user_id is null and new.auth_user_id=auth.uid() and v_email<>'' and lower(btrim(coalesce(old.access_email,'')))=v_email then
   if (to_jsonb(new)-array['auth_user_id']) is distinct from (to_jsonb(old)-array['auth_user_id']) then raise exception 'initial client claim may only set auth ownership' using errcode='42501'; end if;
   return new;
 end if;
 if old.auth_user_id is distinct from auth.uid() then raise exception 'client ownership required' using errcode='42501'; end if;
 -- Match the date advancement performed by dcc_submit_checkin_v2.
 -- Clients cannot change cadence, create an arbitrary date or advance a future date.
 if new.next_checkin_date is distinct from old.next_checkin_date then
   if old.next_checkin_date is null or old.next_checkin_date > v_today then
     raise exception 'check-in date is not due' using errcode='42501';
   end if;
   v_expected_date := case old.checkin_frequency
     when 'weekly' then v_today + 7
     when 'biweekly' then v_today + 14
     when 'monthly' then (v_today + interval '1 month')::date
     else null end;
   if new.next_checkin_date is distinct from v_expected_date then
     raise exception 'invalid check-in date advancement' using errcode='42501';
   end if;
 end if;
 if new.next_photo_checkin_date is distinct from old.next_photo_checkin_date then
   if old.next_photo_checkin_date is null or old.next_photo_checkin_date > v_today then
     raise exception 'photo check-in date is not due' using errcode='42501';
   end if;
   v_expected_date := case old.photo_frequency
     when 'monthly' then (v_today + interval '1 month')::date
     else null end;
   if new.next_photo_checkin_date is distinct from v_expected_date then
     raise exception 'invalid photo check-in date advancement' using errcode='42501';
   end if;
 end if;
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
   'preferred_training_days','wants_photo_checkin','sex','requested_plan','plan','next_checkin_date','next_photo_checkin_date'
 ]) is distinct from
 (to_jsonb(old)-array[
   'weight','initial_weight','status','password_setup_completed','age','height_cm','goal','foods_to_avoid',
   'current_injury','injury_details','previous_surgery','surgery_details',
   'food_allergy','food_allergy_details','trained_before','training_experience',
   'preferred_training_days','wants_photo_checkin','sex','requested_plan','plan','next_checkin_date','next_photo_checkin_date'
 ]) then
   raise exception 'client may only update own onboarding state' using errcode='42501';
 end if;
 if new.status is distinct from old.status and new.status<>'Pendiente' then raise exception 'client may only mark own status pending' using errcode='42501'; end if;
 if old.password_setup_completed=true and new.password_setup_completed=false then raise exception 'password setup cannot be reverted by client' using errcode='42501'; end if;
 return new;
end $function$;
