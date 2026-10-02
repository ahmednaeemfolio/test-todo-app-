import { BadRequestException } from "@nestjs/common";
import { TodoMutationsController } from "./todo-mutations.controller";
import { TodoMutationsService } from "./todo-mutations.service";
import { UpdateTodoDto } from "./update-todo.dto";

describe("TodoMutationsController", () => {
  let controller: TodoMutationsController;
  let mutations: jest.Mocked<Pick<TodoMutationsService, "update" | "remove">>;

  beforeEach(() => {
    mutations = {
      update: jest.fn(),
      remove: jest.fn(),
    };
    controller = new TodoMutationsController(
      mutations as unknown as TodoMutationsService,
    );
  });

  it("updates completion and returns the updated todo", async () => {
    const updatedTodo = {
      id: "todo-1",
      title: "Buy milk",
      completed: true,
      createdAt: new Date("2025-01-01T00:00:00.000Z"),
      updatedAt: new Date("2025-01-02T00:00:00.000Z"),
    };
    mutations.update.mockResolvedValue(updatedTodo);

    const result = await controller.update("todo-1", { completed: true });

    expect(mutations.update).toHaveBeenCalledWith("todo-1", { completed: true });
    expect(result).toBe(updatedTodo);
  });

  it("updates a todo title", async () => {
    const dto: UpdateTodoDto = { title: "Updated title" };
    const updatedTodo = { id: "todo-1", title: dto.title, completed: false };
    mutations.update.mockResolvedValue(updatedTodo);

    await expect(controller.update("todo-1", dto)).resolves.toBe(updatedTodo);
    expect(mutations.update).toHaveBeenCalledWith("todo-1", dto);
  });

  it("rejects an empty or whitespace-only edited title", async () => {
    mutations.update.mockRejectedValue(new BadRequestException("Title must not be empty"));

    await expect(controller.update("todo-1", { title: "  \t " })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(mutations.update).toHaveBeenCalledWith("todo-1", { title: "  \t " });
  });

  it("performs deletion when called for a client-confirmed delete and returns no content", async () => {
    mutations.remove.mockResolvedValue(undefined);

    await expect(controller.remove("todo-1")).resolves.toBeUndefined();
    expect(mutations.remove).toHaveBeenCalledWith("todo-1");
  });
});
