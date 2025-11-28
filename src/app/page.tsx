"use client";
import { Calendar } from "@/components/ui/calendar";
import * as React from "react";
import { useState } from "react";
import axios from "axios";

import ButtonAdd from "@/components/ButtonAdd";
import ButtonTrash from "../components/button-trash/ButtonTrash";
import DarkModeToggle from "../components/check-box-tema-claro-escuro/DarkModeToggle";
export default function Home() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [darkThema, setDarkThema] = useState(false);
  const [handleStatus, setHandleStatus] = useState("Pendente");

  const [nameTask, setNameTask] = useState("");
  const [statusTask, setStatusTask] = useState("Pendente");
  const [dateTask, setDateTask] = useState("");


  const handleDateTask = {
    NameTask: nameTask,
    Status: statusTask,
    DateTask: dateTask
  }
  const urlApi = "http://localhost:5185/api/TakeOnTheTask/registerTask";

  const token =localStorage.getItem("token");

  async function HandleAddTask(e) {
    e.preventDefault();
    try{
      const response = await axios.post(urlApi, handleDateTask,{
        headers: {
          "Content-Type": "application/json",
          Authorization:`Bearer ${token}`,
        },
      });
      console.log(response.data);
      alert("Tarefa adicionada com sucesso");
    }catch(error){
      alert("Erro ao adicionar tarefa");
      console.log(error);
    }
  }
  function handleThema() {
    setDarkThema(!darkThema);
    console.log("darkThema", darkThema);
  }

  return (
    <main className="h-screen flex flex-col bg-gray-100" style={{backgroundColor: darkThema ? "#1B1C1D" : "" ,transition: "background-color 0.2s ease-in-out"}}>
      <nav className="flex items-center justify-around w-full h-17 bg-gray-600 text-white font-bold" style={{backgroundColor: darkThema ? "#242424ff" : ""}}>
        <h1 className="text-3xl flex-1 flex items-center justify-center pl-20">Bem vindo a Sua Lista de Tarefas Fellype</h1>
        <div className="flex items-center justify-center relative right-20">
          <DarkModeToggle handleThema={handleThema}/>
        </div>
      </nav>
      <section className="flex flex-col h-screen items-center justify-center overflow-y-hidden">
        <div className="flex items-start justify-around w-full h-full pt-15">
          <div className="flex flex-col justify-center items-center bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.75)] rounded-md w-[400px] h-[100px] gap-2" style={{backgroundColor: darkThema ? "#242424ff" : "" ,transition: "background-color 0.2s ease-in-out" ,borderColor: darkThema ? "#0019f8ff" : "" ,border: darkThema ? "1px solid #d3d3d3ff" : ""}}>
            <div className="flex justify-center items-center gap-2">
              <input
                type="text"
                placeholder="Adicione uma tarefa"
                className="border border-1 border-gray-400 w-70 h-7 pl-2 rounded-sm outline-none focus:border-blue-600 placeholder: bg-white"
                onChange={(e) => setNameTask(e.target.value)}
              />
              <ButtonAdd />
            </div>
            <input
              type="date"
              className="border border-1 border-gray-400 w-50 h-7 pl-2 rounded-sm outline-none focus:border-blue-600 placeholder: bg-white"
              onChange={(e) => setDateTask(e.target.value)}
            />
          </div>

          <div className="flex flex-col justify-center items-center bg-white  rounded-md w-[400px] h-auto gap-5 p-3 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.75)]" style={{backgroundColor: darkThema ? "#242424ff" : "" ,transition: "background-color 0.2s ease-in-out" ,borderColor: darkThema ? "#0019f8ff" : "" ,border: darkThema ? "1px solid #d3d3d3ff" : ""}}>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm" 
              captionLayout="dropdown"
              style={{backgroundColor: darkThema ? "#1b1b1bff" : "" , color: darkThema ? "#f0f0f0ff" : "" ,transition: "background-color 0.2s ease-in-out"}}
            />
            <div className="flex flex-col w-[100%] h-auto gap-3">
              <div className="flex justify-between items-center h-11 bg-white rounded-md shadow-[1px_1px_2px_0px_rgba(0,0,0,0.75)] " style={{backgroundColor: darkThema ? "#1b1b1bff" : "" , color: darkThema ? "#f0f0f0ff" : "" ,transition: "background-color 0.2s ease-in-out",borderColor: darkThema ? "#0019f8ff" : "" ,border: darkThema ? "1px solid #0019f8ff" : ""}}>

                <div className="h-full bg-red-500 w-[12px] rounded-[3px] relative right-[1px] " style={{backgroundColor: handleStatus === "Pendente" ? "#3a3a3aff" : "#00ff55ff" ,transition: "background-color 0.2s ease-in-out"}}></div>
                <h1 className="flex-1 pl-4">Tarefa1</h1>
                <div className="flex items-center gap-1">
                  <select className="h-6 rounded-sm outline-none border-black border bg-white" style={{backgroundColor: darkThema ? "#3a3a3aff" : "" , color: darkThema ? "#f0f0f0ff" : "" ,transition: "background-color 0.2s ease-in-out", borderColor: darkThema ? "#0019f8ff" : "" ,border: darkThema ? "1px solid #0019f8ff" : ""}} onChange={(e) => setHandleStatus(e.target.value)}>
                    <option value="Pendente">Pendente</option>
                    <option value="Concluido">Concluido</option>
                  </select>
                  <ButtonTrash />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
