import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./theme/ThemeContext.tsx";
import TodoList from "./TodoList/TodoList.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TodoList />
    </ThemeProvider>
  </StrictMode>,
);
