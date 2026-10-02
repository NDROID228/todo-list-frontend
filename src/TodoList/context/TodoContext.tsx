import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import type { TodoAction, TodoState } from "./types";
import { v4 as uuidv4 } from "uuid";

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case "add":
      return {
        todos: [
          ...state.todos,
          { id: uuidv4(), text: action.payload.text, completed: false },
        ],
      };
    case "toggle":
      return {
        todos: state.todos.map((t) =>
          t.id === action.payload.id ? { ...t, completed: !t.completed } : t,
        ),
      };
    case "edit":
      return {
        todos: state.todos.map((t) =>
          t.id === action.payload.id ? { ...t, text: action.payload.text } : t,
        ),
      };
    case "remove":
      return {
        todos: state.todos.filter((t) => t.id !== action.payload.id),
      };
    case "clearCompleted":
      return {
        todos: state.todos.filter((t) => !t.completed),
      };
    default:
      return state;
  }
};

interface TodoContextProps {
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
}
const TodoContext = createContext<TodoContextProps | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const persisted = localStorage.getItem("todos");
  const initialState: TodoState = {
    todos: persisted ? JSON.parse(persisted) : [],
  };

  const [state, dispatch] = useReducer(todoReducer, initialState);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(state.todos));
  }, [state.todos]);

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTodo = (): TodoContextProps => {
  const ctx = useContext(TodoContext);
  if (!ctx) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return ctx;
};
