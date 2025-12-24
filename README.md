# 📋 Task Manager Frontend

Aplicação **frontend** de gerenciamento de tarefas, desenvolvida com **Next.js**, que permite **autenticação de usuários**, **criação**, **listagem**, **filtragem por data**, **atualização de status** e **remoção de tarefas**, com suporte a **Dark Mode**.

Este projeto consome uma **API REST** para autenticação e gerenciamento das tarefas.

---

## 🚀 Funcionalidades

### 🔐 Autenticação
- Login de usuário
- Registro de novos usuários
- Armazenamento de token JWT no `localStorage`
- Proteção de rotas baseada em autenticação

### 📝 Gerenciamento de Tarefas
- Criar novas tarefas
- Definir data da tarefa
- Listar todas as tarefas do usuário
- Filtrar tarefas por data (calendário)
- Atualizar status da tarefa:
  - `Pendente`
  - `Concluído`
- Excluir tarefas

### 🎨 Interface
- Modo Claro / Escuro (Dark Mode)
- Feedback visual de sucesso e erro
- Loading states durante requisições
- Interface responsiva e moderna

---

## 🛠️ Tecnologias Utilizadas

- **Next.js (App Router)**
- **React**
- **TypeScript**
- **Axios**
- **Tailwind CSS**
- **Lucide Icons**
- **React Icons**

---

## 📁 Estrutura de Páginas

- `/` → Login  
- `/register` → Cadastro de usuário  
- `/task` → Página principal de tarefas (dashboard)

---

## 🔗 Integração com API

O projeto consome uma API externa configurada via variável de ambiente:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
