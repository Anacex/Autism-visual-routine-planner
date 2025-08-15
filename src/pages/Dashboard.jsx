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
  setLastUpdated,
} from "../slices/routineSlice";
import { clearUser } from "../slices/authSlice";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Progress } from "../components/ui/progress";
import {
  addRoutineToFirestore,
  saveDailyStep,
  fetchDailySteps,
  deleteDailyStep,
  fetchLastUpdated,
  saveLastUpdated,
  saveHistory,
} from "../utils/saveRoutines";

export default function RoutineBuilder() {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("#FDE68A");
  const steps = useSelector((state) => state.routine.steps);
  const history = useSelector((state) => state.routine.history);
  const lastUpdated = useSelector((state) => state.routine.lastUpdated);
  const { uid } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const todayStr = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    const load = async () => {
      if (!uid) return;
      try {
        const fetchedLastUpdated = await fetchLastUpdated(uid);
        if (fetchedLastUpdated) {
          dispatch(setLastUpdated(fetchedLastUpdated));
        } else {
          dispatch(setLastUpdated(todayStr()));
          await saveLastUpdated(uid, todayStr());
        }
        dispatch(checkDailyReset());
        const fetched = await fetchDailySteps(uid, todayStr());
        if (fetched && fetched.length > 0) {
          dispatch(setSteps(fetched));
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };
    load();
  }, [uid, dispatch]);

  useEffect(() => {
    if (!uid) return;
    const today = todayStr();
    if (lastUpdated !== today) {
      const total = steps.length;
      const completed = steps.filter((s) => s.completed).length;
      if (lastUpdated && total > 0) {
        saveHistory(uid, lastUpdated, completed, total);
      }
      saveLastUpdated(uid, today);
      dispatch(checkDailyReset());
      steps.forEach((step) =>
        saveDailyStep(uid, today, { ...step, completed: false })
      );
    }
  }, [steps, lastUpdated, uid]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !icon) return;
    const action = dispatch(addStep(title, icon, color));
    const created = action.payload;
    if (uid) {
      try {
        await addRoutineToFirestore(uid, created, todayStr());
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
    if (!uid) return;
    try {
      const step = steps.find((s) => s.id === id) || {};
      const updatedStep = { ...step, completed: !step.completed };
      await saveDailyStep(uid, todayStr(), updatedStep);
    } catch (err) {
      console.error("Failed to save toggle to Firestore:", err);
    }
  };

  const handleRemove = async (id) => {
    dispatch(removeStep(id));
    if (!uid) return;
    try {
      await deleteDailyStep(uid, todayStr(), id);
    } catch (err) {
      console.error("Failed to delete step in Firestore:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const completedCount = steps.filter((step) => step.completed).length;
  const totalCount = steps.length;
  const progress = totalCount ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Build Your Routine</h2>
        <Button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </Button>
      </div>

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

        {history && history.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Recent Progress</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              {history.slice(-5).reverse().map((h, index) => (
                <li key={`${h.date}-${index}`}>
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