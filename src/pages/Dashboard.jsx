import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addStep,
  removeStep,
  moveStepUp,
  moveStepDown,
  toggleStep,
  setSteps,
  checkDailyReset,
} from "../slices/routineSlice";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Progress } from "../components/ui/progress";
import {
  addRoutineToFirestore,
  saveDailyStep,
  fetchDailySteps,
  deleteDailyStep,
} from "../utils/saveRoutines";

export default function RoutineBuilder() {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("#FDE68A");
  const steps = useSelector((state) => state.routine.steps);
  const history = useSelector((state) => state.routine.history);
  const dispatch = useDispatch();
  const userId = auth.currentUser?.uid; // Get current user ID

  // helper to get today's date string
  const todayStr = () => new Date().toISOString().split("T")[0];

  // On mount: check for daily reset and load today's steps from Firestore (if logged in)
  useEffect(() => {
    dispatch(checkDailyReset());

    const load = async () => {
      if (!userId) return;
      try {
        const today = todayStr();
        const fetched = await fetchDailySteps(userId, today);
        if (fetched && fetched.length > 0) {
          // If Firestore has steps, populate the Redux store
          dispatch(setSteps(fetched));
        }
      } catch (err) {
        console.error("Failed to load today's steps:", err);
      }
    };

    load();
  }, [userId, dispatch]);

  // Persist all changes to Firestore whenever steps change (debounced would be nicer, but simple approach)
  useEffect(() => {
    // Only attempt save if user is logged in
    if (!userId) return;
    const today = todayStr();
    // Save each step individually (create or update)
    steps.forEach(async (s) => {
      try {
        await saveDailyStep(userId, today, s);
      } catch (err) {
        console.error("Failed to save step:", s.id, err);
      }
    });
  }, [steps, userId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !icon) return;
    // dispatch addStep — dispatch returns the action with payload (the created step)
    const action = dispatch(addStep(title, icon, color));
    const created = action.payload; // { id, title, icon, color, completed }
    // save to Firestore under today's date
    if (userId) {
      try {
        await addRoutineToFirestore(userId, created, todayStr());
      } catch (err) {
        console.error("Failed to add routine to Firestore:", err);
      }
    }
    setTitle("");
    setIcon("");
    setColor("#FDE68A");
  };

  const handleToggle = async (id) => {
    dispatch(toggleStep(id));
    if (!userId) return;
    try {
      // get latest step from local state (after the toggle)
      const step = (steps.find((s) => s.id === id) || {});
      // step may reflect prior state because dispatch is synchronous for reducers,
      // but to be safe, flip completed before save if needed:
      const updatedStep = { ...step, completed: !step.completed };
      await saveDailyStep(userId, todayStr(), updatedStep);
    } catch (err) {
      console.error("Failed to save toggle to Firestore:", err);
    }
  };

  const handleRemove = async (id) => {
    dispatch(removeStep(id));
    if (!userId) return;
    try {
      await deleteDailyStep(userId, todayStr(), id);
    } catch (err) {
      console.error("Failed to delete step in Firestore:", err);
    }
  };

  const completedCount = steps.filter((step) => step.completed).length;
  const totalCount = steps.length;
  const progress = totalCount ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Build Your Routine</h2>

      <form onSubmit={handleAdd} className="flex flex-wrap gap-6 mb-8 justify-center">
        <Input
          className="flex-1 min-w-[200px]"
          placeholder="Step Title (e.g., Brush Teeth)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          className="w-24 text-center"
          placeholder="Emoji (e.g, 🪥)"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          maxLength={2}
        />
        <Input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-10 rounded border"
          title="Pick a color"
        />
        <Button type="submit" className="px-6">
          Add Step
        </Button>
      </form>

      <div>
        <Progress value={progress} className="mb-4" />
        <p className="mb-4 text-center">
          {completedCount} of {totalCount} steps done
        </p>

        <ul className="space-y-3">
          {steps.map((step, idx) => (
            <li
              key={step.id}
              className="flex items-center justify-between p-3 rounded-lg shadow-sm"
              style={{ background: step.color }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{step.icon}</span>
                <span className="text-left">{step.title}</span>
              </div>

              <div className="flex gap-2 items-center">
                <Checkbox checked={step.completed} onCheckedChange={() => handleToggle(step.id)} />
                <Button type="button" size="sm" onClick={() => dispatch(moveStepUp(step.id))} disabled={idx === 0}>
                  ↑
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => dispatch(moveStepDown(step.id))}
                  disabled={idx === steps.length - 1}
                >
                  ↓
                </Button>
                <Button type="button" size="sm" variant="destructive" onClick={() => handleRemove(step.id)}>
                  ✕
                </Button>
              </div>
            </li>
          ))}
        </ul>

        {/* Small history view (last 5 days) */}
        {history && history.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Recent progress</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              {history.slice(-5).reverse().map((h) => (
                <li key={h.date}>
                  <strong>{h.date}</strong>: {h.completed}/{h.total} done
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
