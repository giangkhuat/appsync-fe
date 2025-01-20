// TodoContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { listTodosAppsync } from "@/actions/appsync.actions";
import { PersonalTodo } from "@/components/Todos";
interface TodoContextType {
  personalTodos: PersonalTodo[];
  setPersonalTodos: React.Dispatch<React.SetStateAction<PersonalTodo[]>>;
  fetchTodos: (userId: string) => void;
  deleteTodo: (todoId: string) => void; // Method to delete a todo
  completeTodo: (todoId: string) => void; // Method to mark a todo as complete
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [personalTodos, setPersonalTodos] = useState<PersonalTodo[]>([]);

  // Method to fetch todos based on the user
  const fetchTodos = async (userId: string) => {
    try {
      const data = await listTodosAppsync(userId);
      setPersonalTodos(data || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const deleteTodo = async (todoId: string) => {
    try {
      setPersonalTodos(
        (prevTodos) => prevTodos.filter((todo) => todo.TodoID !== todoId) // Remove deleted todo from the state
      );
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const completeTodo = async (todoId: string) => {
    try {
      //console.log("Completed todo response:", response);
      setPersonalTodos(
        (prevTodos) =>
          prevTodos.map((todo) =>
            todo.TodoID === todoId ? { ...todo, completed: true } : todo
          ) // Update the specific todo as completed in the state
      );
    } catch (error) {
      console.error("Error completing todo:", error);
    }
  };

  return (
    <TodoContext.Provider
      value={{
        personalTodos,
        setPersonalTodos,
        fetchTodos,
        deleteTodo,
        completeTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodoContext must be used within a TodoProvider");
  }
  return context;
};
