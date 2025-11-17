"use client";
import ButtonAdd from "@/components/ButtonAdd";
import { Calendar } from "@/components/ui/calendar";
import * as React from "react";
import ButtonTrash from "../components/button-trash/ButtonTrash";
export default function Home() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <main className="h-screen flex flex-col">
      <nav className="flex items-center justify-center w-full h-17 bg-gray-600 text-white font-bold">
        <h1 className="text-3xl ">Bem vindo a Sua Lista de Tarefas Fellype</h1>
      </nav>
      <section className="flex flex-col h-screen items-center justify-center overflow-y-hidden">
        <div className="flex items-start justify-around w-full h-full pt-15">
          <div className="flex flex-col justify-center items-center bg-white shadow-md rounded-md w-[400px] h-[100px] gap-2">
            <div className="flex justify-center items-center gap-2">
              <input
                type="text"
                placeholder="Adicione uma tarefa"
                className="border border-1 border-gray-400 w-70 h-7 pl-2 rounded-sm outline-none focus:border-blue-600 placeholder: bg-white"
              />
              <ButtonAdd />
            </div>
            <input type="date" className="border border-1 border-gray-400 w-50 h-7 pl-2 rounded-sm outline-none focus:border-blue-600 placeholder: bg-white" />
          </div>

          <div className="flex flex-col justify-center items-center bg-white shadow-md rounded-md w-[400px] h-auto gap-2 p-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm"
              captionLayout="dropdown"
            />
            <div className="flex flex-col w-[100%] h-auto gap-3">
              <div className="flex justify-between items-center h-11 bg-white rounded-md shadow-[1px_1px_2px_0px_rgba(0,0,0,0.75)]">
                <div className="h-full bg-green-500 w-[12px] rounded-[3px]"></div>
                <h1 className="flex-1 pl-4">Tarefa</h1>
                <div>
                  <ButtonTrash/>
                </div>
              </div>
              <div className="flex justify-between items-center h-11 bg-white rounded-md shadow-[1px_1px_2px_0px_rgba(0,0,0,0.75)]">
                <div className="h-full bg-red-500 w-[12px] rounded-[3px]"></div>
                <h1 className="flex-1 pl-4">Tarefa1</h1>
                <div>
                  <ButtonTrash/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
