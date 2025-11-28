"use client";
import { useState ,useEffect} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageSuccessLogin from "./MessageSuccessLogin";
import LoadingDate from "../../components/loading/LoadingDate";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5185/api/AuthenticationUser/login",
        {
          Email: email,
          Password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess(response.data);

      // const token = response.data.token;
      // localStorage.setItem("token", token);
    } catch (error) {
      console.log(error);
      alert("Erro ao fazer login");
    }
  }
  useEffect(() => {
      if (success) {
        setTimeout(() => {
          setSuccess(null);
          setLoading(false);
          router.push("/");
        }, 4000);
      }
  })
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-[url(/backGround/geometric-shapes-background/5390929.jpg)] bg-cover">
      <div className="flex flex-col items-center justify-center h-90 gap-15 w-90  shadow-[0px_0px_2px_4px_rgba(0,0,0,0.35)] rounded-sm bg-stone-100 ">
        <h1 className="text-3xl font-medium">Login</h1>
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 items-center justify-center"
        >
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
            Login
          </button>
        </form>
        <p>
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-blue-600">
            Register
          </a>
        </p>
      </div>
      {success && (
        <div className="absolute top-20 right-10">
          <MessageSuccessLogin success={success} />
        </div>
      )}
    </main>
  );
}
