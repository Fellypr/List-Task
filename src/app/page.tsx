"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";

import MessageSuccess from "../components/message/MessageSuccess";
import MessageError from "../components/message/MessageError";
import LoadingDate from "../components/loading/LoadingDate";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5185/api/AuthenticationUser/login",
        {
          Email: email,
          Password: password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, message } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        setSuccess(message);
        setTimeout(() => {
          setLoading(false);
          router.push("/task");
        }, 3000);
      }
    } catch {
      setError("Email ou senha incorretos");
      setTimeout(() => {
        setError(null);
        setLoading(false);
      }, 3000);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">
        
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
            <div className="w-5 h-5 bg-white rounded-full" />
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-center text-gray-800">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mt-1 mb-8">
          Please sign in to your account
        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Password"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:opacity-90 transition flex items-center justify-center cursor-pointer"
          >
            {loading ? <LoadingDate /> : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-blue-500 font-medium hover:underline">
            Sign Up
          </a>
        </p>
      </div>

      {success && (
        <div className="absolute top-6 right-6">
          <MessageSuccess success={success} />
        </div>
      )}
      {error && (
        <div className="absolute top-6 right-6">
          <MessageError error={error} />
        </div>
      )}
    </main>
  );
}
