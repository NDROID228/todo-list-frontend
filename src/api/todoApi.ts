// src/api/todoApi.ts
// This module contains the fetch‑based client used by the TodoContext to talk to a backend.
// The backend is not implemented yet – the URLs are placeholders that you can adapt.

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const API_BASE = "/api/todos"; // Adjust to your actual backend base path

const todoApi = {
  /** Fetch the entire list of todos */
  async getTodos(): Promise<Todo[]> {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Failed to fetch todos");
    const data = await res.json();
    // Expect an array of Todo objects
    return data as Todo[];
  },

  /** Add a new todo – server should generate an id */
  async addTodo(text: string): Promise<Todo> {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("Failed to add todo");
    return (await res.json()) as Todo;
  },

  /** Toggle completed flag for a todo */
  async toggleTodo(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}/toggle`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to toggle todo");
  },

  /** Edit the text of a todo */
  async editTodo(id: string, text: string): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("Failed to edit todo");
  },

  /** Delete a todo */
  async deleteTodo(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete todo");
  },

  /** Remove all completed todos */
  async clearCompleted(): Promise<void> {
    const res = await fetch(`${API_BASE}/clear-completed`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to clear completed todos");
  },
};

export default todoApi;
