import { Provider } from "react-redux";
    import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
    import Login from "./pages/Login";
    import Signup from "./pages/Signup";
    import Dashboard from "./pages/Dashboard";
    import ProtectedRoute from "./components/ProtectedRoute";
    import { store } from "./store";

    function App() {
      return (
        <Provider store={store}>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Router>
        </Provider>
      );
    }

    export default App;