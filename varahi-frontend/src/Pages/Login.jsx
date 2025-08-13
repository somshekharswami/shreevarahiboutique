import { useNavigate, Navigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../Firebase.js";
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FaArrowRight } from "react-icons/fa";

const Login = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  if (currentUser) return <Navigate to="/" />;

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const simplifiedUser = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      };

      setCurrentUser(simplifiedUser);
      localStorage.setItem("user", JSON.stringify(simplifiedUser));
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const continueAsGuest = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
        {/* Illustration */}
        <div className="bg-gradient-to-br from-pink-200 to-purple-50  w-full md:w-1/2 flex items-center justify-center p-8">
          <img
            src="/shopping-image.svg"
            alt="Boutique"
            width="800"
            height="600"
            className="w-3/4 h-auto object-contain"
          />
        </div>

        {/* Login Area */}
        <div className="w-full md:w-1/2 p-10 text-center">
          <h2 className="text-xl font-bold text-black font-mono">
            Shree Varahi Boutique
          </h2>
          <p className="text-gray-600 font-mono mt-2 mb-6">
            Sign in to access your cart and wishlist.
          </p>

          <button
            onClick={loginWithGoogle}
            className="flex items-center justify-center gap-3 w-full py-3 px-6 border border-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-100 transition"
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative bg-white px-3 text-gray-400 text-sm font-light">
              or
            </div>
          </div>

          <button
            onClick={continueAsGuest}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-4 bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700
 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            Continue as Guest <FaArrowRight />
          </button>

          <p className="text-xs text-gray-400 mt-6">
            Need help?{" "}
            <a
              href="mailto:shreevarahiboutique@gmail.com"
              className="underline"
            >
              shreevarahiboutique@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
