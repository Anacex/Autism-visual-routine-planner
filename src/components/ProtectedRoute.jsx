// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../slices/authSlice";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { uid, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({ uid: user.uid, email: user.email }));
      } else {
        dispatch(clearUser());
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [dispatch]);

  if (loading) return null; // Show loading state
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}