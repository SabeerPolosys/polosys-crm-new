"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginResponse } from "@/types/auth";
import api from "@/lib/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { showToast } from "@/components/common/ShowToast";
import LoginRightSide from "@/components/auth/LoginRightSide";
import { FaRegCircleXmark } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
  const [passwordStrengthValidate, setPasswordStrengthValidate] = useState({
    char8: false,
    oneUpper: false,
    oneLower: false,
    oneNumber: false,
    oneSpecial: false,
  });
  const searchParams = useSearchParams();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isPasswordMatch) {
      return showToast({
        message: `Not match the password.`,
        type: "error",
        duration: 5000,
      });
    }
    if (validatePassword(password)) {
      return showToast({
        message: validatePassword(password),
        type: "error",
        duration: 5000,
      });
    }
    if (!searchParams.get("token") || !searchParams.get("email")) {
      return showToast({
        message: "Sorry, not allowed to perform this action.",
        type: "error",
        duration: 5000,
      });
    }
    setIsLoading(true);
    try {
      const res = await api.post<LoginResponse>(
        `/api/v1/auth/reset-forgotten-password?newpass=${password}&token=${searchParams.get(
          "token"
        )}&email=${searchParams.get("email")}`,
        {}
      );
      if (res?.status == 200) {
        // ✅ Backend should set auth cookie via Set-Cookie
        showToast({
          message: `Your password reseted successfully.`,
          type: "success",
        });
        router.push("/login");
      } else {
        throw new Error("Password reset failed");
      }
    } catch {
      return showToast({
        message: "Failed to reset password.",
        type: "error",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        setIsPasswordMatch(false);
        setError("Password not match.");
      } else {
        setIsPasswordMatch(true);
        setError("");
      }
    } else {
      setIsPasswordMatch(false);
      setError("");
    }
  }, [confirmPassword, password]);
  const validatePassword = (password: string) => {
    const minLength = 8;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
      return "Password must be at least 8 characters long.";
    }
    if (!uppercase.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!lowercase.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!number.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!specialChar.test(password)) {
      return "Password must contain at least one special character.";
    }

    return "";
  };

  useEffect(() => {
    const minLength = 8;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

    const newValidation = {
      char8: password.length >= minLength,
      oneUpper: uppercase.test(password),
      oneLower: lowercase.test(password),
      oneNumber: number.test(password),
      oneSpecial: specialChar.test(password),
    };

    setPasswordStrengthValidate((prev) => ({
      ...prev,
      ...newValidation,
    }));
  }, [password]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Side */}
      <LoginRightSide />

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
          <p className="text-gray-400 mb-6 text-sm">
            Set a new password for your Polosys CRM account.
          </p>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
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
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>
            <div className="border-[1px] border-gray-400 p-2 rounded">
              <p className="text-sm font-medium mb-1">
                Your Password Must Contains
              </p>
              <ul className="text-xs ml-4 leading-6">
                <li className="flex flex-row gap-2 items-center">
                  {passwordStrengthValidate?.char8 ? (
                    <FaRegCheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <FaRegCircleXmark className="w-4 h-4 text-gray-400" />
                  )}
                  Minimum 8 characters
                </li>
                <li className="flex flex-row gap-2 items-center">
                  {passwordStrengthValidate?.oneUpper ? (
                    <FaRegCheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <FaRegCircleXmark className="w-4 h-4 text-gray-400" />
                  )}
                  One uppercase letter
                </li>
                <li className="flex flex-row gap-2 items-center">
                  {passwordStrengthValidate?.oneLower ? (
                    <FaRegCheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <FaRegCircleXmark className="w-4 h-4 text-gray-400" />
                  )}
                  One lowercase letter
                </li>
                <li className="flex flex-row gap-2 items-center">
                  {passwordStrengthValidate?.oneNumber ? (
                    <FaRegCheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <FaRegCircleXmark className="w-4 h-4 text-gray-400" />
                  )}
                  One number
                </li>
                <li className="flex flex-row gap-2 items-center">
                  {passwordStrengthValidate?.oneSpecial ? (
                    <FaRegCheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <FaRegCircleXmark className="w-4 h-4 text-gray-400" />
                  )}
                  One special character
                </li>
              </ul>
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
                Resetting...
              </button>
            ) : isPasswordMatch &&
              Object.values(passwordStrengthValidate).every(Boolean) ? (
              <button
                type="submit"
                className="w-full py-3 rounded-md bg-gray-700 text-white hover:bg-gray-900 transition cursor-pointer"
              >
                Reset Password
              </button>
            ) : (
              <button
                type="button"
                className="w-full py-3 rounded-md bg-gray-500 text-white transition cursor-not-allowed"
                disabled={true}
              >
                Reset Password
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
