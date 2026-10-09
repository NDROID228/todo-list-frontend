// TaskItem.test.tsx – unit tests for the TaskItem component
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoProvider } from "../../../src/TodoList/context/TodoContext";
import TaskItem from "../../../src/TodoList/components/TaskItem";

const todo = { id: "1", text: "Write tests", completed: false };

describe("TaskItem component", () => {
  test("renders todo text and checkbox", () => {
    render(
      <TodoProvider>
        <TaskItem todo={todo} />
      </TodoProvider>,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: /mark “Write tests”/i,
    });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    const span = screen.getByText("Write tests");
    expect(span).toBeInTheDocument();
  });

  test("toggles completed on checkbox click", async () => {
    const user = userEvent.setup();
    render(
      <TodoProvider>
        <TaskItem todo={todo} />
      </TodoProvider>,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: /mark “Write tests”/i,
    });
    await user.click(checkbox);
    // The reducer flips completed, we can assert the UI reflects it
    expect(checkbox).toBeChecked();
  });

  test("edit workflow – opens input, saves on Enter", async () => {
    const user = userEvent.setup();
    render(
      <TodoProvider>
        <TaskItem todo={todo} />
      </TodoProvider>,
    );

    // Click edit button (pencil)
    const editBtn = screen.getByRole("button", { name: /edit “Write tests”/i });
    await user.click(editBtn);

    const input = screen.getByRole("textbox", { name: /edit todo/i });
    expect(input).toBeInTheDocument();
    await user.clear(input);
    await user.type(input, "Write comprehensive tests{Enter}");

    // After submit, the span should show the new text
    expect(screen.getByText("Write comprehensive tests")).toBeInTheDocument();
  });

  test("delete button removes the item", async () => {
    const user = userEvent.setup();
    render(
      <TodoProvider>
        <TaskItem todo={todo} />
      </TodoProvider>,
    );

    const deleteBtn = screen.getByRole("button", {
      name: /delete “Write tests”/i,
    });
    await user.click(deleteBtn);
    // The item should no longer be in the document
    expect(screen.queryByText("Write tests")).not.toBeInTheDocument();
  });
});
