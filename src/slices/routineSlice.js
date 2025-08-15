import { createSlice, nanoid } from "@reduxjs/toolkit";

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
    saveHistory: (state, action) => {
      state.history.push(action.payload);
    },
    setSteps(state, action) {
      state.steps = action.payload || [];
    },
    toggleStep(state, action) {
      const step = state.steps.find((s) => s.id === action.payload);
      if (step) {
        step.completed = !step.completed;
        state.lastUpdated = todayStr();
      }
    },
    resetSteps(state) {
      state.steps.forEach((s) => (s.completed = false));
      state.lastUpdated = todayStr();
    },
    checkDailyReset(state) {
      const today = todayStr();
      if (state.lastUpdated !== today) {
        const total = state.steps.length;
        const completed = state.steps.filter((s) => s.completed).length;
        if (state.lastUpdated && total > 0) {
          state.history.push({
            date: state.lastUpdated,
            completed,
            total,
          });
        }
        state.steps.forEach((s) => (s.completed = false));
        state.lastUpdated = today;
      }
    },
    setLastUpdated(state, action) {
      state.lastUpdated = action.payload;
    },
    removeStep(state, action) {
      state.steps = state.steps.filter((s) => s.id !== action.payload);
    },
    moveStepUp(state, action) {
      const idx = state.steps.findIndex((s) => s.id === action.payload);
      if (idx > 0) {
        [state.steps[idx - 1], state.steps[idx]] = [state.steps[idx], state.steps[idx - 1]];
      }
    },
    moveStepDown(state, action) {
      const idx = state.steps.findIndex((s) => s.id === action.payload);
      if (idx >= 0 && idx < state.steps.length - 1) {
        [state.steps[idx + 1], state.steps[idx]] = [state.steps[idx], state.steps[idx + 1]];
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
  setLastUpdated,
  removeStep,
  moveStepUp,
  moveStepDown,
} = routineSlice.actions;

export default routineSlice.reducer;