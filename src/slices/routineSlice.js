import { createSlice, nanoid } from "@reduxjs/toolkit";

/**
 * Redux slice shape:
 * {
 *   steps: [ { id, title, icon, color, completed } ],
 *   lastUpdated: "YYYY-MM-DD",
 *   history: [ { date, completed, total } ]
 * }
 */

const todayStr = () => new Date().toISOString().split("T")[0];

const initialState = {
  steps: [],
  lastUpdated: todayStr(),
  history: [],
};

const routineSlice = createSlice({
  name: "routine",
  initialState,
  reducers: {
    // Add step — keep prepare so id generation is consistent client-side
    addStep: {
      reducer(state, action) {
        state.steps.push(action.payload);
      },
      prepare(title, icon, color) {
        return {
          payload: {
            id: nanoid(),
            title,
            icon,
            color,
            completed: false,
          },
        };
      },
    },

    // Replace entire steps list (used when loading from Firestore)
    setSteps(state, action) {
      state.steps = action.payload || [];
    },

    // Toggle a single step
    toggleStep(state, action) {
      const step = state.steps.find((s) => s.id === action.payload);
      if (step) {
        step.completed = !step.completed;
        state.lastUpdated = todayStr();
      }
    },

    // Reset all steps (mark all incomplete) and update lastUpdated
    resetSteps(state) {
      state.steps.forEach((s) => (s.completed = false));
      state.lastUpdated = todayStr();
    },

    // Save a snapshot of the day's progress into history and reset for a new day
    checkDailyReset(state) {
      const today = todayStr();
      if (state.lastUpdated !== today) {
        // save summary of previous day (if any steps existed)
        const total = state.steps.length;
        const completed = state.steps.filter((s) => s.completed).length;
        if (state.lastUpdated && total > 0) {
          state.history.push({
            date: state.lastUpdated,
            completed,
            total,
          });
        }
        // reset steps for today
        state.steps.forEach((s) => (s.completed = false));
        state.lastUpdated = today;
      }
    },

    // Remove step
    removeStep(state, action) {
      state.steps = state.steps.filter((s) => s.id !== action.payload);
    },

    // Move step up
    moveStepUp(state, action) {
      const idx = state.steps.findIndex((s) => s.id === action.payload);
      if (idx > 0) {
        [state.steps[idx - 1], state.steps[idx]] = [
          state.steps[idx],
          state.steps[idx - 1],
        ];
      }
    },

    // Move step down
    moveStepDown(state, action) {
      const idx = state.steps.findIndex((s) => s.id === action.payload);
      if (idx >= 0 && idx < state.steps.length - 1) {
        [state.steps[idx + 1], state.steps[idx]] = [
          state.steps[idx],
          state.steps[idx + 1],
        ];
      }
    },
  },
});

export const {
  addStep,
  setSteps,
  toggleStep,
  resetSteps,
  checkDailyReset,
  removeStep,
  moveStepUp,
  moveStepDown,
} = routineSlice.actions;

export default routineSlice.reducer;
