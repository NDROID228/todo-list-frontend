// reducer.test.ts – unit tests for Todo reducer
import { todoReducer } from "../../src/TodoList/context/TodoContext";
import type { TodoState, TodoAction } from "../../src/TodoList/context/types";

describe("todoReducer", () => {
  const initial: TodoState = { todos: [] };

  test("adds a todo", () => {
    const action: TodoAction = { type: "add", payload: { text: "Buy milk" } };
    const next = todoReducer(initial, action);
    expect(next.todos).toHaveLength(1);
    expect(next.todos[0]).toMatchObject({ text: "Buy milk", completed: false });
  });

  test("toggles completed", () => {
    const state: TodoState = {
      todos: [{ id: "1", text: "Task", completed: false }],
    };
    const action: TodoAction = { type: "toggle", payload: { id: "1" } };
    const next = todoReducer(state, action);
    expect(next.todos[0].completed).toBe(true);
  });

  test("edits a todo's text", () => {
    const state: TodoState = {
      todos: [{ id: "1", text: "Old", completed: false }],
    };
    const action: TodoAction = { type: "edit", payload: { id: "1", text: "New" } };
    const next = todoReducer(state, action);
    expect(next.todos[0].text).toBe("New");
  });

  test("removes a todo", () => {
    const state: TodoState = {
      todos: [
        { id: "1", text: "A", completed: false },
        { id: "2", text: "B", completed: false },
      ],
    };
    const next = todoReducer(state, { type: "remove", payload: { id: "1" } });
    expect(next.todos).toHaveLength(1);
    expect(next.todos[0].id).toBe("2");
  });

  test("clears completed", () => {
    const state: TodoState = {
      todos: [
        { id: "1", text: "Done", completed: true },
        { id: "2", text: "Pending", completed: false },
      ],
    };
    const next = todoReducer(state, { type: "clearCompleted", payload: {} });
    expect(next.todos).toHaveLength(1);
    expect(next.todos[0].completed).toBe(false);
  });
});
