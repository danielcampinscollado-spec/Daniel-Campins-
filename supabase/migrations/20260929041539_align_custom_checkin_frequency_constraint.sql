-- F16: the existing RPC and UI already support 'custom' (Solo esta fecha).
-- Replacing only this redundant older CHECK preserves all rows and valid values.
ALTER TABLE public.clients
  DROP CONSTRAINT clients_checkin_frequency_valid,
  ADD CONSTRAINT clients_checkin_frequency_valid
    CHECK (checkin_frequency IS NULL OR checkin_frequency IN ('weekly','biweekly','monthly','custom','off'));
