-- DCC Fitness: independent module access controlled by coach.
-- Safe additive migration. Existing access is initialized from the selected plan.
alter table public.clients
  add column if not exists training_enabled boolean,
  add column if not exists nutrition_enabled boolean;

update public.clients
set
  training_enabled = coalesce(training_enabled, case
    when coalesce(active_plan, requested_plan, plan) in ('training','complete','entrenamiento') then true else false end),
  nutrition_enabled = coalesce(nutrition_enabled, case
    when coalesce(active_plan, requested_plan, plan) in ('nutrition','complete','nutrición','nutricion','alimentación','alimentacion') then true else false end);

comment on column public.clients.training_enabled is 'Coach-controlled access to training module; initialized from selected plan.';
comment on column public.clients.nutrition_enabled is 'Coach-controlled access to nutrition module; initialized from selected plan.';