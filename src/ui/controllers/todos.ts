async function get() {
  return fetch("/api/todos").then(async (response) => {
    const todosString = await response.text();
    const todos = await JSON.parse(todosString);
    return todos;
  });
}

export const todoController = {
  get,
};
