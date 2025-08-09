import { useEffect } from "react";
    import { onAuthStateChanged } from "firebase/auth";
    import { auth } from "../firebase";
    import { Navigate, useNavigate } from "react-router-dom";
    import { useDispatch, useSelector } from "react-redux";
    import { setUser, clearUser } from "../slices/authSlice";

    export default function ProtectedRoute({ children }) {
      const dispatch = useDispatch();
      const { isAuthenticated } = useSelector(state => state.auth);
      const navigate = useNavigate();

      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) dispatch(setUser(user));
          else dispatch(clearUser());
        });
        return () => unsubscribe();
      }, [dispatch]);

      if (!isAuthenticated) return <Navigate to="/login" />;
      return children;
    }