import { useState } from "react";
import "../TodoList.css";
import { useTodo } from "../context/TodoContext";

function TaskInput() {
  const [value, setValue] = useState("");
  const { addTodo } = useTodo();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      await addTodo(trimmed);
      setValue("");
    }
  };

  return (
    <form onSubmit={submit}>
      <div>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="New todo"
          required
        />
        <button type="submit">Add</button>
      </div>
    </form>
  );
}

export default TaskInput;
