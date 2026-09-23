const assert = require('node:assert/strict');
const { test } = require('node:test');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '../auth-session-guard-v2.js'), 'utf8');

function fixture(role) {
  let authChanged;
  const clearedTimers = [];
  const opened = [];
  const nodes = Object.fromEntries(['login', 'client', 'coach', 'dcc-secure-auth-status'].map(id =>
    [id, { style: { display: id === role ? 'block' : 'none' }, dataset: {} }]));
  const state = {
    console, currentApp: role, currentScreen: 'messages', currentClientId: 'previous-client',
    selectedClient: 'previous-client', __dccSecureRole: role, __dccCoachChatV2: 'previous-client',
    activeWorkout: { clientId: 'previous-client', sets: [{ reps: 8 }] },
    workoutPausedScreen: 'messages', trainingDayTab: 4,
    restTimerInterval: 11, dccWorkoutElapsedInterval: 12,
    clearInterval: id => clearedTimers.push(id),
    data: { clients: [{ id: 'previous-client' }], diets: { 'previous-client': {} } },
    saveData() {}, addEventListener() {},
    openApp(app) { opened.push(app); this.currentApp = app; nodes[app].style.display = 'block'; return true; },
    document: {
      readyState: 'loading', addEventListener() {}, querySelector() { return null; },
      getElementById(id) { return nodes[id]; },
    },
    supabaseClient: { auth: {
      async getSession() { return { data: { session: state.session }, error: null }; },
      onAuthStateChange(fn) { authChanged = fn; },
    } },
    session: { user: { id: 'previous-user' } },
  };
  state.window = state;
  vm.runInNewContext(source, state);
  return { state, nodes, opened, clearedTimers, signOut() { state.session = null; authChanged('SIGNED_OUT', null); } };
}

for (const [from, to] of [['client', 'coach'], ['coach', 'client']]) {
  test(`${from} → logout → ${to}: no previous profile or workout survives`, async () => {
    const f = fixture(from);
    f.signOut();
    assert.equal(f.state.currentApp, '');
    assert.equal(f.state.currentScreen, '');
    assert.equal(f.state.currentClientId, null);
    assert.equal(f.state.selectedClient, null);
    assert.equal(f.state.__dccSecureRole, null);
    assert.equal(f.state.__dccCoachChatV2, null);
    assert.equal(f.state.activeWorkout, null);
    assert.equal(f.state.workoutPausedScreen, null);
    assert.equal(f.state.trainingDayTab, 0);
    assert.deepEqual(f.clearedTimers, [11, 12]);
    assert.equal(f.nodes.client.style.display, 'none');
    assert.equal(f.nodes.coach.style.display, 'none');
    assert.equal(f.nodes.login.style.display, 'flex');
    assert.equal(await f.state.openApp(from), false, 'no session must never open a panel');
    f.state.session = { user: { id: 'next-user' } };
    f.state.__dccSecureRole = to;
    assert.equal(await f.state.openApp(to), true);
    assert.deepEqual(f.opened, [to]);
  });
}

test('valid client session cannot open coach panel', async () => {
  const f = fixture('client');
  assert.equal(await f.state.openApp('coach'), false);
  assert.deepEqual(f.opened, []);
});

test('same-role authenticated entry preserves the active workout', async () => {
  const f = fixture('client');
  const workout = f.state.activeWorkout;
  assert.equal(await f.state.openApp('client'), true);
  assert.equal(f.state.activeWorkout, workout);
  assert.deepEqual(f.clearedTimers, []);
});
