import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import type { TodoAction, TodoState, Todo } from "./types";
import { v4 as uuidv4 } from "uuid";
import todoApi from "../../api/todoApi";

// ------------------------------------------------------------------
// Reducer – now supports a "set" action to replace the whole list
// ------------------------------------------------------------------
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
    case "set":
      // Replace the whole list – used when we load from the backend
      return { todos: action.payload.todos };
    default:
      return state;
  }
};

// ------------------------------------------------------------------
// Context shape – expose async helpers for components
// ------------------------------------------------------------------
interface TodoContextProps {
  state: TodoState;
  // Synchronous dispatch (rarely used directly by UI)
  dispatch: React.Dispatch<TodoAction>;
  // Async helpers – perform a backend request then update state
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  editTodo: (id: string, text: string) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
}

const TodoContext = createContext<TodoContextProps | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  // Initialise empty state – we will replace it once we fetch from backend
  const [state, dispatch] = useReducer(todoReducer, { todos: [] });

  // ----------------------------------------------------------------
  // Load initial todos from the backend (or fallback to localStorage)
  // ----------------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const remoteTodos = await todoApi.getTodos();
        dispatch({ type: "set", payload: { todos: remoteTodos } });
        localStorage.setItem("todos", JSON.stringify(remoteTodos));
      } catch (err) {
        // Backend unavailable – fall back to persisted local storage
        const persisted = localStorage.getItem("todos");
        if (persisted) {
          const localTodos: Todo[] = JSON.parse(persisted);
          dispatch({ type: "set", payload: { todos: localTodos } });
        }
      }
    };
    load();
  }, []);

  // ----------------------------------------------------------------
  // Keep localStorage in sync whenever the list changes
  // ----------------------------------------------------------------
  useEffect(() => {
    if (state.todos.length) {
      localStorage.setItem("todos", JSON.stringify(state.todos));
    }
  }, [state.todos]);

  // ----------------------------------------------------------------
  // Async wrappers that call the API then update local state via reducer
  // ----------------------------------------------------------------
  const addTodo = async (text: string) => {
    const created = await todoApi.addTodo(text);
    // API returns the full Todo object (including id). Use it directly.
    dispatch({ type: "add", payload: { text: created.text } });
  };

  const toggleTodo = async (id: string) => {
    await todoApi.toggleTodo(id);
    dispatch({ type: "toggle", payload: { id } });
  };

  const editTodo = async (id: string, text: string) => {
    await todoApi.editTodo(id, text);
    dispatch({ type: "edit", payload: { id, text } });
  };

  const removeTodo = async (id: string) => {
    await todoApi.deleteTodo(id);
    dispatch({ type: "remove", payload: { id } });
  };

  const clearCompleted = async () => {
    await todoApi.clearCompleted();
    dispatch({ type: "clearCompleted" });
  };

  return (
    <TodoContext.Provider
      value={{
        state,
        dispatch,
        addTodo,
        toggleTodo,
        editTodo,
        removeTodo,
        clearCompleted,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

// ------------------------------------------------------------------
// Hook to consume the context – guarantees we are inside a provider
// ------------------------------------------------------------------
export const useTodo = (): TodoContextProps => {
  const ctx = useContext(TodoContext);
  if (!ctx) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return ctx;
};
