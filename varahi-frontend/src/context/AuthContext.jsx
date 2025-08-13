import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchCart } from "../redux/slices/cartSlice";
import { setCurrentUser, clearCurrentUser } from "../redux/slices/authSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const dispatch = useDispatch();

  useEffect(() => {
    if (process.env.NODE_ENV === "test") {
      localStorage.setItem("firebaseToken", "test-token");
      // optionally set user object in state so UI shows logged in
      setCurrentUser({ uid: "test-firebase-uid", email: "test@example.com" });
      return; // skip real Firebase auth check
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const simplifiedUser = {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          };

          // Update local state and Redux
          setCurrentUserState(simplifiedUser);
          dispatch(setCurrentUser(simplifiedUser));
          localStorage.setItem("user", JSON.stringify(simplifiedUser));

          // Fetch cart from backend

          await dispatch(fetchCart(user.uid));

          // Optional: send user to your backend
          try {
            const res = await fetch("http://localhost:5000/api/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(simplifiedUser),
            });
            if (!res.ok) throw new Error("Failed to send user to MongoDB");
          } catch (err) {
            console.error("❌ Error sending user to MongoDB:", err);
          }
        } else {
          setCurrentUserState(null);
          dispatch(clearCurrentUser());
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Auth state change error:", error);
      } finally {
        setLoading(false); // Set loading to false after auth check
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser: setCurrentUserState, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
