"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { User, Mail, Lock } from "lucide-react";

import MessageSuccess from "../../components/message/MessageSuccess";
import LoadingDate from "../../components/loading/LoadingDate";
import MessageError from "../../components/message/MessageError";

interface ValidationErros {
  errors: Record<string, string[]>;
  title: string;
  status: number;
}

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const formtValidationErrors = (errorData: ValidationErros): string => {
    const allMessages: string[] = [];
    for (const name in errorData.errors) {
      errorData.errors[name].forEach(msg =>
        allMessages.push(`- ${name}: ${msg}`)
      );
    }
    return allMessages.join("\n");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5185/api/AuthenticationUser/register",
        {
          Name: username,
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
          router.push("/");
        }, 3000);
      }
    } catch (err) {
      const axiosError = err as AxiosError<ValidationErros | string>;
      let message = "Houve um erro ao registrar.";

      if (axiosError.response) {
        const data = axiosError.response.data;
        if (typeof data === "object" && data !== null && "errors" in data) {
          message = formtValidationErrors(data as ValidationErros);
        } else if (typeof data === "string") {
          message = data;
        }
      }

      setError(message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(""), 4000);
    }
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
            <div className="w-5 h-5 bg-white rounded-full" />
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-center text-gray-800">
          Create Account
        </h1>
        <p className="text-center text-gray-500 mt-1 mb-8">
          Please fill in your details
        </p>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="relative">
            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
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
            {loading ? <LoadingDate /> : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <a href="/" className="text-blue-500 font-medium hover:underline">
            Login
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
