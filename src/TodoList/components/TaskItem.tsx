import { useTodo } from "../context/TodoContext";
import type { Todo } from "../context/types";
import "../TodoList.css";
import React, { useState } from "react";

type TaskItemProps = {
  todo: Todo;
};

function TaskItem({ todo }: TaskItemProps) {
  const { dispatch } = useTodo();

  const toggle = () => dispatch({ type: "toggle", payload: { id: todo.id } });
  const remove = () => dispatch({ type: "remove", payload: { id: todo.id } });

  // ---------- Edit states ----------
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const startEdit = () => {
    setEditText(todo.text);
    setIsEditing(true);
  };

  const submitEdit = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) {
      dispatch({ type: "edit", payload: { id: todo.id, text: trimmed } });
    }
    setIsEditing(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      submitEdit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  return (
    <li>
      <input type="checkbox" checked={todo.completed} onChange={toggle} className="todo-checkbox" />
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={submitEdit}
          onKeyDown={handleKey}
          className="edit-input"
          aria-label={`Edit todo: ${todo.text}`}
          style={{ flex: 1 }}
          autoFocus
        />
      ) : (
        <span
          role="checkbox"
          aria-checked={todo.completed}
          onClick={toggle}
          style={{
            textDecoration: todo.completed ? "line-through" : "none",
            cursor: "pointer",
            flex: 1,
          }}
        >
          {todo.text}
        </span>
      )}
      {/* edit button */}
      <button
        type="button"
        onClick={startEdit}
        className="edit-btn"
        aria-label={`Edit “${todo.text}”`}
      >
        ✎
      </button>
      {/* delete button */}
      <button
        type="button"
        onClick={remove}
        className="delete-btn"
        aria-label={`Delete “${todo.text}”`}
      >
        ✕
      </button>
    </li>
  );
}

export default TaskItem;
