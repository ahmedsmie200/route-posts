import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "../../services/auth";

const schema = zod.object({
  name: zod.string().nonempty("Name is required").min(3, "Min 3 characters").max(20, "Max 20 characters"),
  email: zod.string().nonempty("Email is required").regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"),
  password: zod.string().nonempty("Password is required")
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "8+ chars, upper, lower, number, special char"),
  rePassword: zod.string().nonempty("Please confirm your password"),
  dateOfBirth: zod.coerce.date().refine(val => {
    return new Date().getFullYear() - val.getFullYear() >= 18;
  }, "You must be at least 18 years old"),
  gender: zod.string().nonempty("Gender is required"),
}).refine(d => d.password === d.rePassword, {
  path: ["rePassword"],
  message: "Passwords do not match",
});

export default function Register() {
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", rePassword: "", dateOfBirth: "", gender: "" },
  });

  async function onSubmit(data) {
    setLoading(true);
    setApiError(null);
    const res = await signUp(data);
    if (res.message === "success") {
      navigate("/login");
    } else {
      setApiError(res.message || "Something went wrong");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors">
      <div
        className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative min-h-[600px] transition-colors"
        style={{
          boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)",
        }}
      >
        <div
          className="w-full md:w-1/2 p-12 text-white flex flex-col justify-center relative z-0 md:absolute md:left-0 md:top-0 md:h-full"
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)",
          }}
        >
          <div className="md:pr-20">
            <h1 className="text-5xl font-black mb-4 tracking-wider leading-tight">WELCOME<br />TO A-BOOK!</h1>
            <p className="text-lg opacity-90 mb-10 font-light">
              Connect with friends and the world around you on A-book.
            </p>

            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur border border-white/20">
              <p className="text-xs font-bold tracking-widest mb-3 opacity-70">ABOUT A-BOOK</p>
              <h3 className="font-bold text-xl mb-3">Where Connections Come to Life</h3>
              <p className="text-sm opacity-80 mb-5">
                A-book is the premier social network.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[["2026", "Platform Launch"], ["40K+", "Active Users"], ["50k+", "Posts Shared"]].map(([v, l]) => (
                  <div key={l} className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
                    <p className="font-bold text-lg">{v}</p>
                    <p className="text-xs opacity-70">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[60%] p-8 md:p-12 flex flex-col justify-center relative z-10 bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white ml-auto transition-colors"
          style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0 100%)" }}>
          <div className="md:pl-20">
            <h2 className="text-4xl font-bold mb-8 tracking-wide text-center md:text-left">Sign Up</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative group">
                  <input
                    {...register("name")}
                    placeholder="Full Name"
                    className={`w-full bg-transparent border-b-2 py-2 pr-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none transition-colors 
                      ${errors.name ? "border-red-400" : "border-gray-300 dark:border-gray-600 focus:border-blue-500 hover:border-blue-400"}`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1 absolute -bottom-5 left-0">{errors.name.message}</p>}
                </div>

                <div className="relative group">
                  <input
                    {...register("email")}
                    placeholder="Email Address"
                    type="email"
                    className={`w-full bg-transparent border-b-2 py-2 pr-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none transition-colors 
                      ${errors.email ? "border-red-400" : "border-gray-300 dark:border-gray-600 focus:border-blue-500 hover:border-blue-400"}`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1 absolute -bottom-5 left-0">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                <div className="relative group">
                  <select
                    {...register("gender")}
                    className={`w-full bg-transparent border-b-2 py-2 text-gray-900 dark:text-white outline-none transition-colors appearance-none
                      ${errors.gender ? "border-red-400" : "border-gray-300 dark:border-gray-600 focus:border-blue-500 hover:border-blue-400"}`}
                  >
                    <option value="" className="bg-white dark:bg-[#0f172a] text-gray-500 dark:text-gray-400">Select Gender</option>
                    <option value="male" className="bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white">Male</option>
                    <option value="female" className="bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white">Female</option>
                  </select>
                  {errors.gender && <p className="text-xs text-red-500 mt-1 absolute -bottom-5 left-0">{errors.gender.message}</p>}
                </div>

                <div className="relative group">
                  <input
                    {...register("dateOfBirth")}
                    type="date"
                    className={`w-full bg-transparent border-b-2 py-2 text-gray-900 dark:text-white outline-none transition-colors 
                      ${errors.dateOfBirth ? "border-red-400" : "border-gray-300 dark:border-gray-600 focus:border-blue-500 hover:border-blue-400"}
                      dark:[&::-webkit-calendar-picker-indicator]:filter-[invert(1)]`}
                  />
                  {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1 absolute -bottom-5 left-0">{errors.dateOfBirth.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                <div className="relative group">
                  <input
                    {...register("password")}
                    placeholder="Password"
                    type="password"
                    className={`w-full bg-transparent border-b-2 py-2 pr-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none transition-colors 
                      ${errors.password ? "border-red-400" : "border-gray-300 dark:border-gray-600 focus:border-blue-500 hover:border-blue-400"}`}
                  />
                  {errors.password && <p className="text-xs text-red-500 mt-1 absolute -bottom-5 left-0 max-w-full truncate" title={errors.password.message}>{errors.password.message}</p>}
                </div>

                <div className="relative group">
                  <input
                    {...register("rePassword")}
                    placeholder="Confirm Password"
                    type="password"
                    className={`w-full bg-transparent border-b-2 py-2 pr-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none transition-colors 
                      ${errors.rePassword ? "border-red-400" : "border-gray-300 dark:border-gray-600 focus:border-blue-500 hover:border-blue-400"}`}
                  />
                  {errors.rePassword && <p className="text-xs text-red-500 mt-1 absolute -bottom-5 left-0">{errors.rePassword.message}</p>}
                </div>
              </div>

              {apiError && <p className="text-sm text-red-400 text-center mt-4 bg-red-900/30 py-2 rounded-lg border border-red-500/30">{apiError}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-1/2 py-2.5 rounded-full font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-60 flex justify-center items-center gap-2 mx-auto md:mx-0"
                style={{ background: "linear-gradient(90deg, #2563eb, #3b82f6)" }}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>

              <p className="text-sm text-gray-600 dark:text-gray-400 mt-6 text-center md:text-left transition-colors">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-500 dark:hover:text-blue-300 transition-colors drop-shadow-none dark:drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Tabs({ active }) {
  return null;
}
export function LeftPanel() {
  return null;
}