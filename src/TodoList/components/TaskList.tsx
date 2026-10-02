import { useTodo } from "../context/TodoContext";
import "../TodoList.css";
import TaskItem from "./TaskItem";

function TaskList() {
  const {
    state: { todos },
  } = useTodo();
  return (
    <section>
      <ul>
        {todos.map((todo) => (
          <TaskItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
}

export default TaskList;
