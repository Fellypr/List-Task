"use client";
import { useState } from "react";
import axios from "axios";

import MessageSuccess from "./MessageSuccess"
export default function Register(){
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:5185/api/AuthenticationUser/register", {
                Name: username,
                Email: email,
                Password: password
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setSuccess(response.data);
        }catch(error){
            console.log(error);
            alert("Registration failed!");
        }
    }
    return(
        <main className="flex flex-col items-center justify-center h-screen bg-[url(/backGround/geometric-shapes-background/5390929.jpg)] bg-cover">
            <div className="flex flex-col items-center justify-center h-90 gap-10 w-90  shadow-[0px_0px_2px_4px_rgba(0,0,0,0.35)] rounded-sm bg-stone-100 ">
                <h1 className="text-3xl font-medium">Register</h1>
                <form onSubmit={handleRegister} className="flex flex-col gap-4 items-center justify-center">
                    <input type="text" placeholder="Username" className="border-1 border-gray-400 w-70 h-7 pl-2 rounded-sm outline-none focus:border-blue-600 placeholder: bg-white" onChange={(e) => setUsername(e.target.value)}/>
                    <input type="email" placeholder="Email" className="border-1 border-gray-400 w-70 h-7 pl-2 rounded-sm outline-none focus:border-blue-600 placeholder: bg-white" onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" placeholder="Password" className="border-1 border-gray-400 w-70 h-7 pl-2 rounded-sm outline-none focus:border-blue-600 placeholder: bg-white" onChange={(e) => setPassword(e.target.value)}/>
                    <button  className="w-50 bg-blue-600 text-white p-2 rounded-sm relative top-5 hover:bg-blue-700 hover:cursor-pointer">Register</button>
                </form>
                <p>Already have an account? <a href="/login" className="text-blue-600">Login</a></p>
            </div>

            <div className="absolute top-20 right-10">
                <MessageSuccess success={success}/>
            </div>
        </main>
    )
}