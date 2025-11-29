"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import MessageSuccess from "./MessageSuccess";
import LoadingDate from "../../components/loading/LoadingDate";
import MessageError from "./MessageError";
export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        router.push("/");
      }
    }
  }, []);

  const handleRegister = async (e) => {
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
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const {token , message} = response.data;
      if (token) {
        localStorage.setItem("token", token);
        setSuccess(message);
        setTimeout(() => {
          setSuccess(null);
          setLoading(false);
          router.push("/");
        }, 4000);
      } else {
        console.log("No token received");
      }
    } catch (error) {
      let message = "";
      if (error.response) {
        message = error.response.data;
      } else if (error.request) {
        message = error.request;
      } else {
        message = error.message;
      }
      setError(message);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 4000);
    }
  });

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-[url(/backGround/geometric-shapes-background/5390929.jpg)] bg-cover">
      <div className="flex flex-col items-center justify-center h-90 gap-10 w-90  shadow-[0px_0px_2px_4px_rgba(0,0,0,0.35)] rounded-sm bg-stone-100">
        <h1 className="text-3xl font-medium">Register</h1>
        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-4 items-center justify-center"
        >
          <input
            type="text"
            placeholder="Username"
            className="border-1 border-gray-400 w-70 h-7 pl-2 rounded-sm outline-none focus:border-blue-600 placeholder: bg-white"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="border-1 border-gray-400 w-70 h-7 pl-2 rounded-sm outline-none focus:border-blue-600 placeholder: bg-white"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border-1 border-gray-400 w-70 h-7 pl-2 rounded-sm outline-none focus:border-blue-600 placeholder: bg-white"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-50 bg-blue-600 text-white p-2 rounded-sm relative top-5 hover:bg-blue-700 hover:cursor-pointer flex items-center justify-center">
            {loading && (
              <div className="flex items-center justify-start relative right-10 ">
                <LoadingDate />
              </div>
            )}
            Register
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <a href="/login" className="text-blue-600">
            Login
          </a>
        </p>
      </div>

      {success && (
        <div className="absolute top-20 right-10">
          <MessageSuccess success={success} />
        </div>
      )}
      {error && (
        <div className="absolute top-20 right-10">
          <MessageError error={error} />
        </div>
      )}
    </main>
  );
}
