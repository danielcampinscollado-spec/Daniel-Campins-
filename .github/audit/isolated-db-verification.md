# Isolated database verification — 2026-09-29

Target: afhwzsfpwjdgulvfhpye ONLY. No production writes. Empty schema snapshot copied 19 public tables, 33 functions and 72 policies; no customer rows.

Synthetic actors: client A/B and coach A/B. Tests execute SET LOCAL ROLE authenticated with fixture JWT claims, not a privileged role. They do not replace browser E2E.

- F02 reproduced 42501 before correction; initial questionnaire now saves sex/requested plan/weight.
- F10 reproduced 23502 for optional empty food preferences; empty and NULL input now save an empty string.
- F09 reproduced acceptance of NULL required values and active-to-pending replay; both rejected after the correction. Initial weight history remains one row.
- Clients cannot activate their own/other plans. Coach A cannot see or activate B; coach A can activate A.
- F04 anon execution revoked; authenticated execution preserved; security advisor no longer reports anon SECURITY DEFINER execution.

Remaining: authenticated SECURITY DEFINER endpoints need ownership tests across every path. Browser E2E, Storage upload/download, session restoration and mobile remain pending. Password-leak detection is disabled in the Free test project; do not buy an upgrade as part of the audit.
