import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { listAllTodosAppsync } from "@/actions/appsync.actions";
import { PersonalTodo } from "@/components/Todos";

interface TodoContextType {
  sharedTodos: PersonalTodo[];
  setSharedTodos: React.Dispatch<React.SetStateAction<PersonalTodo[]>>;
  fetchTodos: (userId: string) => void;
  deleteTodo: (todoId: string) => void; // Method to delete a todo
  completeTodo: (todoId: string) => void; // Method to mark a todo as complete
}

const SharedTodoContext = createContext<TodoContextType | undefined>(undefined);

export const SharedTodoProvider = ({ children }: { children: ReactNode }) => {
  const [sharedTodos, setSharedTodos] = useState<PersonalTodo[]>([]);

  // Method to fetch todos based on the user
  const fetchTodos = async (userId: string) => {
    try {
      const data = await listAllTodosAppsync();
      setSharedTodos(data || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const deleteTodo = async (todoId: string) => {
    try {
      setSharedTodos(
        (prevTodos) => prevTodos.filter((todo) => todo.TodoID !== todoId) // Remove deleted todo from the state
      );
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const completeTodo = async (todoId: string) => {
    console.log("completed to do ", todoId);
    try {
      //console.log("Completed todo response:", response);
      setSharedTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.TodoID === todoId ? { ...todo, completed: true } : todo
        )
      );
    } catch (error) {
      console.error("Error completing todo:", error);
    }
  };

  return (
    <SharedTodoContext.Provider
      value={{
        sharedTodos,
        setSharedTodos,
        fetchTodos,
        deleteTodo,
        completeTodo,
      }}
    >
      {children}
    </SharedTodoContext.Provider>
  );
};

export const useSharedTodoContext = () => {
  const context = useContext(SharedTodoContext);
  if (!context) {
    throw new Error("useTodoContext must be used within a TodoProvider");
  }
  return context;
};
