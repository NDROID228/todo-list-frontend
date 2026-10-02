import "./TodoList.css";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import TodoFooter from "./components/TodoFooter/TodoFooter";
import TodoHeader from "./components/TodoHeader/TodoHeader";
import { TodoProvider } from "./context/TodoContext";

function TodoList() {
  return (
    <TodoProvider>
      <main>
        <TodoHeader />
        <TaskInput />
        <TaskList />
        <TodoFooter />
      </main>
    </TodoProvider>
  );
}

export default TodoList;
