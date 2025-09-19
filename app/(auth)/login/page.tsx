"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LoginRequest, LoginResponse } from "@/types/auth";
import api from "@/lib/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ForgotPassword from "@/components/auth/ForgotPassword";
import { showToast } from "@/components/common/ShowToast";
import LoginRightSide from "@/components/auth/LoginRightSide";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const payload: LoginRequest = {
      username: user,
      password: password,
    };
    // Clear any existing timeout before starting a new one
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }

    try {
      const res = await api.post<LoginResponse>(
        `/api/v1/auth?username=${payload?.username}&pass=${payload.password}`
      );
      if (res?.status == 200 && res?.data?.message === "Login successful") {
        // ✅ Backend should set auth cookie via Set-Cookie
        showToast({
          message: `Login successfully.`,
          type: "success",
        });
        router.push("/");
      } else {
        throw new Error("Login failed");
      }
    } catch (err: any) {
      setError("Invalid username or password.");
      errorTimeoutRef.current = setTimeout(() => {
        setError("");
        errorTimeoutRef.current = null;
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Side */}
      <LoginRightSide />

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">Sign in</h2>
          <p className="text-gray-400 mb-6 text-sm">
            Get start with an account on Polosys CRM
          </p>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              required={true}
            />
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div>{error && <p className="text-red-500 text-xs">{error}</p>}</div>
            <div className="text-right">
              <div
                className="text-sm text-gray-500 hover:underline cursor-pointer"
                onClick={() => setIsOpen(true)}
              >
                Forgot password
              </div>
            </div>
            {isLoading ? (
              <button
                type="button"
                disabled
                className="w-full py-3 rounded-md bg-gray-500 text-white opacity-70 cursor-not-allowed flex items-center justify-center"
              >
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Authenticating...
              </button>
            ) : (
              <button
                type="submit"
                className="w-full py-3 rounded-md bg-gray-700 text-white hover:bg-gray-900 transition cursor-pointer"
              >
                Sign in
              </button>
            )}
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Don't have a Polosys account?{" "}
            <a href="#" className="text-gray-900 font-medium hover:underline">
              Sign up
            </a>
          </p>
        </div>
        <ForgotPassword isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </div>
  );
}
