"use client";
import * as React from "react";
import Link from 'next/link';
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Trash2, Plus, Sun, Moon, LinkIcon } from "lucide-react";
import { RiUser6Line } from "react-icons/ri";
import MessageSuccess from "@/components/message/MessageSuccess";
import { da } from "date-fns/locale";

interface UserInfo {
  Name: string;
}

interface ValidationErros {
  errors: Record<string, string[]>;
  title: string;
  status: number;
}

interface Task {
  IdTask: string | number;
  NameTask: string;
  Status: "Pendente" | "Concluido";
  DateTask: string;
  [key: string]: any;
}

interface CalendarProps {
  selected: Date;
  onSelect: (date: Date | undefined) => void;
  className: string;
  style: React.CSSProperties;
}

interface DarkModeToggleProps {
  handleThema: () => void;
  darkThema: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
  selected,
  onSelect,
  className,
  style,
}) => (
  <div className={`p-3 border rounded-md shadow-md ${className}`} style={style}>
    <h3
      className="text-center font-semibold mb-2"
      style={{ color: style.color }}
    >
      Selecione a Data
    </h3>
    <input
      type="date"
      value={selected ? selected.toISOString().split("T")[0] : ""}
      onChange={(e) => {
        const date = e.target.value
          ? new Date(e.target.value + "T12:00:00")
          : undefined;
        onSelect(date);
      }}
      className="w-full p-2 border rounded-md text-center outline-none focus:ring-2 focus:ring-blue-600"
      style={{
        backgroundColor: style.backgroundColor,
        color: style.color,
        borderColor: style.borderColor || "gray",
      }}
    />
  </div>
);



const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  handleThema,
  darkThema,
}) => (
  <button
    onClick={handleThema}
    className="p-2 rounded-full text-white hover:bg-gray-700 transition duration-150 cursor-pointer"
  >
    {darkThema ? (
      <Sun className="w-6 h-6 text-yellow-300" />
    ) : (
      <Moon className="w-6 h-6 text-gray-900" />
    )}
  </button>
);

const getProp = (obj: Task | UserInfo, key: string): any =>
  obj[key] ||
  obj[key.charAt(0).toLowerCase() + key.slice(1)] ||
  obj[key.charAt(0).toUpperCase() + key.slice(1)];

const convertToIsoDate = (dateString: string | undefined): string | null => {
  if (!dateString) return null;
  try {
    const d = new Date(dateString);
    return d.toISOString().split("T")[0];
  } catch (e) {
    return null;
  }
};
const ButtonAdd: React.FC = () => (
  <button
    type="submit"
    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-3 rounded-md transition duration-150 shadow-md flex items-center justify-center cursor-pointer"
  >
    <Plus className="w-5 h-5" />
  </button>
);

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [darkThema, setDarkThema] = useState<boolean>(false);
  const [nameTask, setNameTask] = useState<string>("");
  const [taskDateInput, setTaskDateInput] = useState<string>("");
  const [inforUser, setInforUser] = useState<UserInfo | null>(null);
  const [allUserTasks, setAllUserTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const token: string | null =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  const taskDataToSend = {
    NameTask: nameTask,
    Status: "Pendente",
    DateTask: taskDateInput,
  };

  const formtValidationErrors = (errorData :ValidationErros) : string => {
    const allMessages : string[] = [];
    for(const NameErros in errorData.errors){
      if(Object.prototype.hasOwnProperty.call(errorData.errors,NameErros)){
        const messages = errorData.errors[NameErros];
        messages.forEach(msg => allMessages.push(`- ${msg}`));
      }
    }
    return allMessages.join("\n");
  }

  async function HandleUserInfo() {
    if (!token) return;
    try {
      const response = await axios.get<UserInfo>(
        `${apiBaseUrl}/api/AuthenticationUser/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInforUser(response.data);
    } catch (error) {}
  }

  async function HandleGetAllTasks() {
    setLoading(true);
    if (!token) {
      setErrorMessage("Token não encontrado. Faça login.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get<Task[]>(
        `${apiBaseUrl}/api/TakeOnTheTask/getAllTasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(response.data)) {
        setAllUserTasks(response.data);
        setErrorMessage(null);
      } else {
        setAllUserTasks([]);
      }
    } catch (error) {
      setAllUserTasks([]);
      setErrorMessage("Error de carregamento de tarefas. Tente novamente Mais Tarde.");
    } finally {
      setLoading(false);
    }
  }

  async function HandleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!nameTask || !taskDateInput) {
      setErrorMessage("Preencha nome e data.");
      return;
    }

    try {
      await axios.post(
        `${apiBaseUrl}/api/TakeOnTheTask/registerTask`,
        taskDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNameTask("");
      setTaskDateInput("");
      setSuccessMessage("Tarefa adicionada com sucesso!");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
      HandleGetAllTasks();
    } catch (error) {
      const axiosError = error as AxiosError<ValidationErros | string>;
      let message: string =
        "Ouve um erro ao registrar. Por favor, tente novamente.";
      if (axiosError.response) {
        const status = axiosError.response.status;
        const data = axiosError.response.data;
        if (
          status === 400 &&
          typeof data === "object" &&
          data !== null &&
          "errors" in data
        ) {
          message = formtValidationErrors(data as ValidationErros);
        } else if (typeof data === "string") {
          message = data;
        } else {
          message =
            (data as { title?: string }).title ||
            `erro ${status} no sevidor. Por favor, tente novamente mais tarde.`;
        }
      } else {
        message = axiosError.message;
      }
      setErrorMessage(message);
    }
  }

  async function HandleUpdateStatus(
    taskId: string | number,
    newStatus: string
  ) {
    const updatedTasks = allUserTasks.map((t) => {
      const tId = getProp(t, "IdTask");
      return tId === taskId
        ? { ...t, Status: newStatus, status: newStatus }
        : t;
    });
    setAllUserTasks(updatedTasks);

    try {
      await axios.put(
        `${apiBaseUrl}/api/TakeOnTheTask/updateTask/${taskId}`,
        { Status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      HandleGetAllTasks();
    }
  }

  async function HandleDeleteTask(taskId: string | number) {
    const filtered = allUserTasks.filter(
      (t) => getProp(t, "IdTask") !== taskId
    );
    setAllUserTasks(filtered);

    try {
      await axios.delete(`${apiBaseUrl}/api/TakeOnTheTask/deleteTask/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      HandleGetAllTasks();
    }
  }

  useEffect(() => {
    HandleUserInfo();
    HandleGetAllTasks();
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setFilteredTasks([]);
      return;
    }

    const selectedDateString = convertToIsoDate(selectedDate.toISOString());

    const filtered = allUserTasks.filter((tarefa) => {
      const rawDate: string = getProp(tarefa, "DateTask");
      const taskDate = convertToIsoDate(rawDate);

      const match = taskDate === selectedDateString;

      return match;
    });

    setFilteredTasks(filtered);
  }, [selectedDate, allUserTasks]);

  function handleThema() {
    setDarkThema(!darkThema);
  }

  const getStatusColor = (status: string): string =>
    status === "Concluido" ? "#00ff55ff" : "#ffaf01ff";

  return (
    <main
      className={`h-screen flex flex-col ${darkThema ? "dark" : ""}`}
      style={{
        backgroundColor: darkThema ? "#1B1C1D" : "#f3f4f6",
        transition: "background-color 0.2s",
      }}
    >
      <nav
        className="flex items-center justify-around w-full h-17 text-white font-bold shadow-md"
        style={{ backgroundColor: darkThema ? "#242424ff" : "#2166c7ff" }}
      >
        <Link href="/" className="flex flex-col items-center justify-center relative left-20 text-red-500 hover:text-red-600 transition duration-150">
          <RiUser6Line size={20}/>
          <p>Logout</p>
        </Link>
        <h1 className="text-3xl flex-1 flex items-center justify-center  py-4">
          Lista de Tarefas de {inforUser ? getProp(inforUser, "Name") : "..."}
        </h1>
        <div className="flex flex-col items-center justify-center relative right-20">
          <DarkModeToggle handleThema={handleThema} darkThema={darkThema} />
        </div>
      </nav>

      {errorMessage && (
        <div className="w-full text-center p-2 bg-red-100 text-red-800 border-b border-red-200">
          {errorMessage}
        </div>
      )}

      <section className="flex flex-col h-full items-center pt-8 overflow-y-auto">
        <div className="flex flex-wrap justify-center gap-10 w-full max-w-6xl">
          <form
            className="flex flex-col justify-center items-center bg-white shadow-xl rounded-lg w-[400px] h-[160px] gap-4 p-4"
            style={{
              backgroundColor: darkThema ? "#242424ff" : "white",
              borderColor: darkThema ? "#0019f8ff" : "",
              border: darkThema ? "1px solid" : "",
            }}
            onSubmit={HandleAddTask}
          >
            <h2
              className="text-xl font-semibold"
              style={{ color: darkThema ? "#f0f0f0ff" : "#1f2937" }}
            >
              Adicionar Nova Tarefa
            </h2>
            <div className="flex justify-center items-center gap-2">
              <input
                type="text"
                placeholder="Nome da Tarefa"
                className="border border-gray-400 w-60 h-8 pl-2 rounded-md outline-none"
                onChange={(e) => setNameTask(e.target.value)}
                value={nameTask}
                required
                style={{
                  color: darkThema ? "#f0f0f0ff" : "black",
                  backgroundColor: darkThema ? "#1b1b1bff" : "white",
                }}
              />
              <ButtonAdd  />
            </div>
            <input
              type="date"
              className="border border-gray-400 w-60 h-8 pl-2 rounded-md outline-none"
              onChange={(e) => setTaskDateInput(e.target.value)}
              value={taskDateInput}
              required
              style={{
                color: darkThema ? "#f0f0f0ff" : "black",
                backgroundColor: darkThema ? "#1b1b1bff" : "white",
              }}
              min={new Date().toISOString().split("T")[0]}
            />
          </form>

          <div
            className="flex flex-col items-center bg-white rounded-lg w-[400px] p-1 shadow-xl"
            style={{
              backgroundColor: darkThema ? "#242424ff" : "white",
              borderColor: darkThema ? "#0019f8ff" : "",
              border: darkThema ? "1px solid" : "",
            }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: darkThema ? "#f0f0f0ff" : "#1f2937" }}
            >
              Data do Filtro
            </h2>
            <Calendar
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border shadow-sm"
              style={{
                backgroundColor: darkThema ? "#1b1b1bff" : "white",
                color: darkThema ? "#f0f0f0ff" : "black",
              }}
            />
          </div>
        </div>

        <div
          className="flex flex-col w-full max-w-3xl h-auto gap-3 p-6 mt-8 mb-10 bg-white rounded-xl shadow-2xl"
          style={{
            backgroundColor: darkThema ? "#242424ff" : "white",
            borderColor: darkThema ? "#0019f8ff" : "",
            border: darkThema ? "1px solid" : "",
          }}
        >
          <div className="flex items-center justify-around w-[100%]">
            <h2
              className="text-2xl font-bold"
              style={{ color: darkThema ? "#f0f0f0ff" : "#1f2937" }}
            >
              Tarefas do dia{" "}
              {selectedDate ? selectedDate.toLocaleDateString("pt-BR") : ""}
            </h2>
            <div className="flex items-center gap-2">
              <div className="bg-[#ffaf01ff] w-3 h-3 rounded-full"></div>
              <p style={{ color: darkThema ? "#f0f0f0ff" : "#1f2937" }}>
                Pendente
              </p>
              <div className="bg-[#00ff55ff] w-3 h-3 rounded-full"></div>
              <p style={{ color: darkThema ? "#f0f0f0ff" : "#1f2937" }}>
                Concluido
              </p>
            </div>
          </div>
          <div className="flex flex-col w-[100%] h-auto gap-3 max-h-80 overflow-y-auto">
            {loading ? (
              <h1
                className="text-center"
                style={{ color: darkThema ? "#f0f0f0ff" : "#1f2937" }}
              >
                Carregando...
              </h1>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-4">
                <h1 style={{ color: darkThema ? "#f0f0f0ff" : "#1f2937" }}>
                  Nenhuma tarefa encontrada.
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Verifique se você selecionou a data correta no calendário.
                </p>
              </div>
            ) : (
              filteredTasks.map((tarefa, index) => {
                const tId = getProp(tarefa, "IdTask") as string | number;
                const tName = getProp(tarefa, "NameTask") as string;
                const tStatus = getProp(tarefa, "Status") as string;

                const statusColor = getStatusColor(tStatus);
                const isConcluido = tStatus === "Concluido";

                return (
                  <div
                    key={tId || index}
                    className="flex justify-between items-center h-12 bg-white rounded-md shadow-sm border border-gray-200"
                    style={{
                      backgroundColor: darkThema ? "#1b1b1bff" : "white",
                      color: darkThema ? "#f0f0f0ff" : "black",
                      borderColor: darkThema ? "#0019f8ff" : "",
                    }}
                  >
                    <div
                      className="h-full w-[8px] rounded-l-md transition duration-300"
                      style={{ backgroundColor: statusColor }}
                    ></div>
                    <h1
                      className="flex-1 pl-4 text-base font-medium truncate"
                      style={{
                        textDecoration: isConcluido ? "line-through" : "none",
                      }}
                    >
                      {tName}
                    </h1>
                    <div className="flex items-center gap-2 pr-2">
                      <select
                        className="h-7 rounded-md outline-none border bg-white px-1 text-sm cursor-pointer"
                        value={tStatus}
                        onChange={(e) =>
                          HandleUpdateStatus(tId, e.target.value)
                        }
                        style={{
                          color: darkThema ? "#ffffffff" : "black",
                          borderColor: darkThema ? "#0019f8ff" : "",
                          backgroundColor: darkThema ? "#1b1b1bff" : "white",
                        }}
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Concluido">Concluído</option>
                      </select>
                      <button
                        onClick={() => HandleDeleteTask(tId)}
                        className="p-1.5 rounded-full hover:bg-red-100 text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <p style={{ color: darkThema ? "#f0f0f0ff" : "#1f2937" }}>
            Existe {filteredTasks.length} tarefas
          </p>
        </div>
        {successMessage && (
          <div className="absolute top-20 right-10">
            <MessageSuccess success={successMessage} />
          </div>
        )}
      </section>
    </main>
  );
}
