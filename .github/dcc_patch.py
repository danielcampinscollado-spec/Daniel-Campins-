from pathlib import Path

path = Path('index.html')
s = path.read_text(encoding='utf-8')

# RepDB already exposes an absolute URL; do not prefix it with ./
old_image = '''              const image=
                ex.image
                  ? `./${ex.image}`
                  : "";'''
new_image = '''              const image=
                ex.image || "";'''
if old_image not in s:
    raise SystemExit('RepDB image block not found')
s = s.replace(old_image, new_image, 1)

# Apply the day-level global rests to the workout session.
start = s.index('function startWorkout(dayIndex){')
end = s.index('function renderWorkoutSession(){', start)
block = s[start:end]
old_exercises = '  const exercises = day.exercises || [];'
new_exercises = '''  const exercises = (day.exercises || []).map(ex=>({
    ...ex,
    restBetweenSets:
      day.restBetweenSetsGlobal !== undefined
        ? Math.max(0,parseInt(day.restBetweenSetsGlobal)||0)
        : Math.max(0,parseInt(ex.restBetweenSets)||0),
    restBetweenExercises:
      day.restBetweenExercisesGlobal !== undefined
        ? Math.max(0,parseInt(day.restBetweenExercisesGlobal)||0)
        : Math.max(0,parseInt(ex.restBetweenExercises)||0)
  }));'''
if old_exercises not in block:
    raise SystemExit('startWorkout exercises block not found')
block = block.replace(old_exercises, new_exercises, 1)
s = s[:start] + block + s[end:]

# Persist the global rests into every exercise for compatibility.
start = s.index('async function saveConfiguredTraining(id,dayIndex){')
end = s.index('function removeTrainingExercise(', start)
block = s[start:end]
marker = '  day.trainingSetupStep="complete";'
insert = '''  const restBetweenSetsGlobal =
    Math.max(0,parseInt(day.restBetweenSetsGlobal)||0);

  const restBetweenExercisesGlobal =
    Math.max(0,parseInt(day.restBetweenExercisesGlobal)||0);

  day.exercises.forEach(ex=>{
    ex.restBetweenSets=restBetweenSetsGlobal;
    ex.restBetweenExercises=restBetweenExercisesGlobal;
  });

'''
if marker not in block:
    raise SystemExit('saveConfiguredTraining marker not found')
block = block.replace(marker, insert + marker, 1)
s = s[:start] + block + s[end:]

path.write_text(s, encoding='utf-8')

# Clean up the one-shot helper files in the patch commit.
Path('.github/workflows/dcc-training-fix.yml').unlink(missing_ok=True)
Path('.github/dcc_patch.py').unlink(missing_ok=True)
