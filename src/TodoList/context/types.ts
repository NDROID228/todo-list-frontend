export interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

export interface TodoState {
    todos: Todo[];
}

export type TodoAction = 
    | { type: "add"; payload: { text: string }}
    | { type: "toggle"; payload: { id: string }}
    | { type: "edit"; payload: { id: string, text: string }}
    | { type: "remove"; payload: { id: string }}
    | { type: "clearCompleted" };