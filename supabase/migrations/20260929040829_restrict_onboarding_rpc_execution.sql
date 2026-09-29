-- F04: both endpoints require a signed-in user and enforce ownership internally.
REVOKE EXECUTE ON FUNCTION public.dcc_set_client_plan(text,text,boolean) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.dcc_submit_initial_questionnaire(numeric,integer,numeric,text,text,boolean,text,boolean,text,boolean,text,boolean,text,integer,boolean,text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.dcc_set_client_plan(text,text,boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.dcc_submit_initial_questionnaire(numeric,integer,numeric,text,text,boolean,text,boolean,text,boolean,text,boolean,text,integer,boolean,text,text) TO authenticated;
