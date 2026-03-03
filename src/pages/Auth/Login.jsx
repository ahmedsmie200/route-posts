import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useNavigate, Link } from "react-router-dom";
import { signIn } from "../../services/auth";
import { UserContext } from "../../context/UserContext";
import { User, Lock, ArrowRight } from "lucide-react";

const schema = zod.object({
  email: zod.string().nonempty("Email is required").regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"),
  password: zod.string().nonempty("Password is required"),
});

export default function Login() {
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { saveUser } = useContext(UserContext);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data) {
    setLoading(true);
    setApiError(null);
    const res = await signIn(data);
    if (res.success === true) {
      saveUser(res.data);
      navigate("/feed", { replace: true });
    } else {
      setApiError(res.message || "Something went wrong");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors">
      <div
        className="w-full max-w-4xl h-[550px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex relative transition-colors"
        style={{
          boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)",
        }}
      >
        <div className="w-full md:w-[60%] p-6 md:p-12 flex flex-col justify-center relative z-10 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white transition-colors md:[clip-path:polygon(0_0,100%_0,80%_100%,0_100%)]">
          <h2 className="text-4xl font-bold mb-10 tracking-wide text-center md:text-left pr-0 md:pr-20">Login</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 pr-0 md:pr-20">
            <div className="relative group">
              <input
                {...register("email")}
                placeholder="Email or username"
                type="email"
                className={`w-full bg-transparent border-b-2 py-2 pr-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none transition-colors 
                  ${errors.email ? "border-red-400" : "border-gray-300 dark:border-gray-600 focus:border-blue-500 hover:border-blue-400"}`}
              />
              <User size={18} className="absolute right-2 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              {errors.email && <p className="text-xs text-red-500 mt-1 absolute -bottom-5 left-0">{errors.email.message}</p>}
            </div>

            <div className="relative group mt-2">
              <input
                {...register("password")}
                placeholder="Password"
                type="password"
                className={`w-full bg-transparent border-b-2 py-2 pr-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none transition-colors 
                  ${errors.password ? "border-red-400" : "border-gray-300 dark:border-gray-600 focus:border-blue-500 hover:border-blue-400"}`}
              />
              <Lock size={18} className="absolute right-2 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              {errors.password && <p className="text-xs text-red-500 mt-1 absolute -bottom-5 left-0">{errors.password.message}</p>}
            </div>

            {apiError && <p className="text-sm text-red-400 text-center mt-2">{apiError}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full md:w-1/2 py-2.5 rounded-full font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-60 flex justify-center items-center gap-2 mx-auto md:mx-0"
              style={{ background: "linear-gradient(90deg, #2563eb, #3b82f6)" }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center md:text-left transition-colors">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-500 dark:hover:text-blue-300 transition-colors drop-shadow-none dark:drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]">Sign Up</Link>
            </p>
          </form>
        </div>

        <div
          className="hidden md:flex flex-col justify-center items-center absolute right-0 top-0 w-1/2 h-full p-12 text-white text-center"
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)",
            zIndex: 1
          }}
        >
          <div className="pl-10">
            <h1 className="text-5xl font-black mb-4 tracking-wider leading-tight">WELCOME<br />BACK!</h1>
            <p className="text-lg opacity-90 max-w-sm mx-auto font-light">
              Connect with friends and the world around you on A-book.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}